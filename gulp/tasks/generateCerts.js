import { exec, execFile } from 'child_process';
import os from 'os';
import log from 'fancy-log';

/**
 * Returns the first non-internal IPv4 address found on the machine,
 * or null if none is found.
 */
function getLocalIp() {
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }

    return null;
}

/**
 * Installs the mkcert local CA into the system trust store and generates
 * SSL certificates for localhost and the current machine's local IP address.
 *
 * Runs every time `yarn serve` starts so that:
 * - The local CA is always trusted (mkcert -install is idempotent).
 * - The certificate always covers the current IP, which may change between
 *   network environments (e.g. switching from home to office WiFi).
 *
 * Uses fixed output filenames (-cert-file / -key-file flags) so browserSync.js
 * always references localhost.pem / localhost-key.pem regardless of how many
 * subjects the certificate covers.
 *
 * Only prerequisite: mkcert must be installed on the machine.
 * macOS: brew install mkcert
 * Firefox users: also run brew install nss before yarn serve.
 */
function generateCerts(done) {
    exec('mkcert --version', (error) => {
        if (error) {
            log.warn(
                '[generateCerts] mkcert is not installed — skipping certificate generation.'
            );
            log.warn(
                '[generateCerts] macOS: brew install nss && brew install mkcert'
            );
            return done();
        }

        // Install local CA into the system trust store, which covers Chrome, Edge and Safari
        // automatically. Firefox uses its own separate certificate store (NSS) and requires
        // the nss package to be installed (brew install nss) for mkcert -install to cover it.
        // Idempotent — safe to run on every serve start.
        exec('mkcert -install', (error) => {
            if (error) {
                log.error(
                    '[generateCerts] Failed to install local CA:',
                    error.message
                );
                return done();
            }

            const localIp = getLocalIp();
            const hosts = localIp ? ['localhost', localIp] : ['localhost'];
            const args = [
                '-cert-file', 'localhost.pem',
                '-key-file', 'localhost-key.pem',
                ...hosts,
            ];

            execFile('mkcert', args, (error) => {
                if (error) {
                    log.error(
                        '[generateCerts] Failed to generate certificates:',
                        error.message
                    );
                } else {
                    log.info(
                        `[generateCerts] Certificates generated for: ${hosts.join(', ')}`
                    );
                }

                done();
            });
        });
    });
}

generateCerts.displayName = 'generateCerts';

export default generateCerts;
