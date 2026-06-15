/**
 * Configuration and middleware for the BrowserSync reverse proxy.
 * Handles URL rewriting between browser-sync host and the upstream Magento store,
 * including response body rewriting, cookie fixes, CSP stripping, header patching,
 * and POST body rewriting for link masking compatibility.
 */
import yargs from 'yargs/yargs';
import { PassThrough } from 'stream';

import paths from '../paths.js';

const argv = yargs(process.argv.slice(2)).parseSync();

/**
 * Middleware that rewrites outbound request headers before they are forwarded
 * to the upstream server.
 *
 * The browser sends Referer and Origin headers containing localhost:3000, which
 * the upstream Magento instance doesn't recognise as its own base URL. This breaks
 * any server-side logic that uses the Referer to reconstruct the current page context —
 * most notably the AJAX layered navigation filter, which uses the Referer to build
 * the combined filter redirect URL (e.g. test-products.html?material=Nylon&activity=Yoga).
 * Without this fix, selecting a second filter produces a URL missing the page path
 * and previously selected filters.
 */
function createRequestHeaderRewriteMiddleware(sourceUrl) {
    return function (req, _res, next) {
        const hostUrl = `https://${req.headers.host}`;
        const protoRelHost = `//${req.headers.host}`;

        ['referer', 'origin'].forEach((header) => {
            if (req.headers[header]) {
                req.headers[header] = req.headers[header]
                    .split(hostUrl)
                    .join(sourceUrl)
                    .split(protoRelHost)
                    .join(sourceUrl);
            }
        });

        next();
    };
}

/**
 * Middleware that rewrites URLs in POST request bodies before they are forwarded
 * to the upstream server.
 *
 * Some Magento mechanisms (e.g. link masking) embed the redirect destination URL
 * inside the POST body (url= form field). Our response rewriter changes those URLs
 * from magesuite.me to localhost:3000, but Magento validates the destination against
 * the store's base URL and returns 404 for unknown hosts.
 *
 * This middleware reverses that rewrite on the way out: any occurrence of the
 * browser-sync host (e.g. https://localhost:3000) in a POST body is replaced back
 * with the upstream origin before the request is proxied.
 *
 * Works for both server-rendered hidden inputs and dynamically created forms
 * (PostHelper data-post JSON processed by post.js).
 */
function createRequestBodyRewriteMiddleware(sourceUrl) {
    return function (req, _res, next) {
        if (req.method !== 'POST') return next();

        // Derive the host URL the same way the response rewriter does.
        const hostUrl = `https://${req.headers.host}`;
        // Magento sometimes generates protocol-relative URLs (//host instead of https://host).
        // These also end up in POST bodies and must be reversed to the full sourceUrl.
        const protoRelHost = `//${req.headers.host}`;

        const chunks = [];
        req.on('data', (chunk) =>
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        );
        req.on('end', () => {
            const body = Buffer.concat(chunks).toString('utf8');

            // Replace both plain and URL-encoded forms of the host URL, including
            // protocol-relative variants (//localhost:3000 → https://magesuite.me).
            const encodedHost = encodeURIComponent(hostUrl);
            const encodedProtoRelHost = encodeURIComponent(protoRelHost);
            const encodedSource = encodeURIComponent(sourceUrl);
            const newBody = body
                .split(encodedHost)
                .join(encodedSource)
                .split(encodedProtoRelHost)
                .join(encodedSource)
                .split(hostUrl)
                .join(sourceUrl)
                .split(protoRelHost)
                .join(sourceUrl);

            const newBodyBuffer = Buffer.from(newBody, 'utf8');
            req.headers['content-length'] = String(newBodyBuffer.length);
            delete req.headers['transfer-encoding'];

            // Override req.pipe so http-proxy forwards our modified body.
            // http-proxy calls req.pipe(proxyReq) to stream the request body —
            // by binding pipe to a PassThrough containing the modified buffer,
            // the proxy receives the rewritten content instead of the original.
            const modifiedStream = new PassThrough();
            modifiedStream.end(newBodyBuffer);
            req.pipe = modifiedStream.pipe.bind(modifiedStream);

            next();
        });
    };
}

/**
 * Middleware that rewrites URLs in JS and JSON responses.
 * browser-sync's built-in rewriteRules only apply to text/html — this covers the rest.
 */
function createUrlRewriteMiddleware(sourceUrl) {
    const rewriteTypes = ['javascript', 'json', 'html'];

    return function (req, res, next) {
        // Derive target URL from the incoming request so that both localhost:3000
        // and any external IP (e.g. 192.168.1.x:3000) work correctly. Without this,
        // all rewritten URLs would point to localhost:3000 regardless of which address
        // the browser used, causing CORS errors and broken navigation on external IPs.
        const targetUrl = `https://${req.headers.host}`;

        // Rewrite Location headers on 302 redirects so the browser follows them through
        // browser-sync rather than going directly to magesuite.me. Without this, POST-based
        // redirect mechanisms (e.g. link masking: POST to linkmasking/filter/redirect/ → 302
        // to the actual destination) bypass browser-sync entirely after the redirect.
        const _setHeader = res.setHeader.bind(res);
        res.setHeader = function (name, value) {
            if (
                name.toLowerCase() === 'location' &&
                typeof value === 'string'
            ) {
                value = value.split(sourceUrl).join(targetUrl);
            }
            return _setHeader(name, value);
        };

        // Capture original res.write/res.end before any other middleware (e.g. resp-modifier) wraps them
        const _write = res.write.bind(res);
        const _end = res.end.bind(res);
        // Buffer all response body chunks so we can do string replacement on the full body
        const chunks = [];

        // Intercept write calls to buffer chunks instead of sending them immediately
        res.write = function (chunk) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        };

        res.end = function (chunk) {
            // Capture any final chunk passed directly to end()
            if (chunk) {
                chunks.push(
                    Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
                );
            }

            // Strip CSP header — our URL rewriting modifies inline <script> content
            // (replacing magesuite.me URLs with localhost:3000), which changes each script's
            // SHA256 hash. The CSP header still references the original hashes for the
            // unmodified scripts, so the browser blocks the rewritten versions. This is not
            // an issue on magesuite.me where scripts are served unmodified. Removing the
            // header entirely is safe for local development.
            // Without this fix, checkout inline scripts are blocked by CSP, breaking the
            // checkout flow on localhost.
            res.removeHeader('content-security-policy');

            const contentType = res.getHeader('content-type') || '';
            const contentEncoding = res.getHeader('content-encoding') || '';
            // Only rewrite text-based types; skip compressed responses (can't do string replacement on binary)
            const shouldRewrite =
                rewriteTypes.some((type) => contentType.includes(type)) &&
                !contentEncoding;

            if (shouldRewrite && chunks.length > 0) {
                try {
                    let body = Buffer.concat(chunks).toString('utf8');
                    // Magento encodes URLs in four different ways depending on context:
                    // 1. Plain:             https://magesuite.me      (e.g. href attributes)
                    // 2. Backslash-escaped: https:\/\/magesuite.me    (e.g. JSON in static data-post attributes)
                    // 3. Double-escaped:    https:\\/\\/magesuite.me   (e.g. PostHelper JSON stored as a string
                    //                      value inside x-magento-init JSON — double json_encode in PHP causes
                    //                      each backslash to be escaped again; KO then decodes the outer JSON
                    //                      and uses the inner single-escaped value to set data-post via data-bind)
                    // 4. Unicode-escaped:   https\u003A\u002F\u002Fmagesuite.me  (e.g. BASE_URL / RequireJS baseUrl)
                    // All four must be replaced so the browser never constructs requests to magesuite.me,
                    // which would be blocked by CORS when the page is served via browser-sync.
                    const escapedSource = sourceUrl.replace('://', ':\\/\\/');
                    const escapedTarget = targetUrl.replace('://', ':\\/\\/');
                    const doubleEscapedSource = sourceUrl.replace(
                        '://',
                        ':\\\\\\/\\\\\\/'
                    );
                    const doubleEscapedTarget = targetUrl.replace(
                        '://',
                        ':\\\\\\/\\\\\\/'
                    );
                    const unicodeSource = sourceUrl.replace(
                        '://',
                        '\\u003A\\u002F\\u002F'
                    );
                    const unicodeTarget = targetUrl.replace(
                        '://',
                        '\\u003A\\u002F\\u002F'
                    );
                    body = body
                        .split(sourceUrl)
                        .join(targetUrl)
                        .split(escapedSource)
                        .join(escapedTarget)
                        .split(doubleEscapedSource)
                        .join(doubleEscapedTarget)
                        .split(unicodeSource)
                        .join(unicodeTarget);
                    // Rewrite Magento's cookieDomain option to empty string.
                    // customer-data.js calls $.cookieStorage.setConf({ domain: cookieDomain })
                    // which makes every subsequent cookie write (mage-cache-sessid, section_data_ids)
                    // use domain=magesuite.me — silently rejected by the browser on localhost.
                    // Without mage-cache-sessid, customer-data.js wipes localStorage on every
                    // page load (invalidateCacheByCloseCookieSession), clearing the cart.
                    // Setting cookieDomain to "" skips the domain config entirely (falsy check).
                    // Without this fix, the offcanvas minicart loses its contents on every page reload.
                    body = body.replace(
                        /"cookieDomain"\s*:\s*"[^"]*"/g,
                        '"cookieDomain":""'
                    );
                    // Reverse URL rewrite for PostHelper redirect destination inputs.
                    // <input name="url"> hidden fields carry the redirect target for server-side
                    // processing (e.g. link masking: POST to linkmasking/filter/redirect/ → 302).
                    // Magento validates this URL against the store's base URL and returns 404 for
                    // unknown hosts, so it must remain as the original domain. The resulting 302
                    // Location header is intercepted and rewritten by the res.setHeader override above.
                    body = body.replace(
                        /<input\b[^>]*\bname="url"[^>]*>/gi,
                        (match) => {
                            // The value may be absolute (https://localhost:3000) or protocol-relative
                            // (//localhost:3000) — Magento sometimes generates protocol-relative URLs.
                            // Both forms must be reversed to the full sourceUrl so Magento can
                            // validate the redirect destination against the store's base URL.
                            const protoRelTarget = targetUrl.replace(
                                /^https:/,
                                ''
                            );
                            return match
                                .split(targetUrl)
                                .join(sourceUrl)
                                .split(protoRelTarget)
                                .join(sourceUrl);
                        }
                    );
                    res.setHeader(
                        'content-length',
                        Buffer.byteLength(body, 'utf8')
                    );
                    _end(body);
                } catch {
                    // On error, flush buffered chunks unmodified
                    chunks.forEach((c) => _write(c));
                    _end();
                }
            } else {
                // Not a rewritable type — flush buffered chunks unmodified
                chunks.forEach((c) => _write(c));
                _end();
            }
        };

        next();
    };
}

/**
 * Settings for serve task.
 */
const settings = {
    /**
     * BrowserSync configuration.
     */
    browserSync: {
        open: argv.open,
        https: {
            key: 'localhost-key.pem',
            cert: 'localhost.pem',
        },
        proxy: {
            target: 'https://magesuite.me',
            proxyOptions: {
                secure: false,
                // Rewrite cookie domains from magesuite.me to empty string (host-only).
                // Without this, Set-Cookie headers from the upstream carry domain=magesuite.me,
                // so the browser stores them for magesuite.me and never sends them on localhost
                // requests. Magento's sections mechanism (mage-cache-sessid, section_data_ids)
                // depends on these cookies being readable on the current host, so without the
                // rewrite the minicart appears empty after every page reload.
                cookieDomainRewrite: {
                    'magesuite.me': '',
                },
            },
            // Asks the proxy target to send uncompressed responses.
            // Currently not needed — nginx does not gzip responses in this setup.
            // Useful as a safety net if gzip is ever enabled on the server, since
            // resp-modifier (browser-sync's built-in rewrite layer) cannot do string
            // replacement on compressed response bodies.
            reqHeaders: {
                'accept-encoding': 'identity',
            },
        },
        middleware: [
            createRequestHeaderRewriteMiddleware('https://magesuite.me'),
            createRequestBodyRewriteMiddleware('https://magesuite.me'),
            createUrlRewriteMiddleware('https://magesuite.me'),
        ],
        rewriteRules: [
            {
                match: '.magesuite.me',
                replace: '',
            },
        ],
        serveStatic: [
            {
                route: `${paths.distWeb}/en_US`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/en_GB`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/de_DE`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/en_DE`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/de_AT`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/en_AT`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/de_CH`,
                dir: `${paths.dist}/web`,
            },
            {
                route: `${paths.distWeb}/en_CH`,
                dir: `${paths.dist}/web`,
            },
        ],
        files: [`${paths.dist}/**/*`],
        reloadDelay: 1000,
        cors: true,
    },
};

export default settings;
