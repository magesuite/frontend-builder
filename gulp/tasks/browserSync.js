import browserSyncLib from 'browser-sync';

import settings from '../config/browserSync.js';

const bs = browserSyncLib.create();

/**
 * Task for starting BrowserSync as a reverse proxy in front of the Magento store.
 * Handles URL rewriting, SSL termination, cookie fixes, and CSP stripping to make
 * the dev proxy transparent to the browser. Config in gulp/config/browserSync.js.
 */
export default function browserSync() {
    bs.init(settings.browserSync);
}
