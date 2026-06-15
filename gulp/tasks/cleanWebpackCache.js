import log from 'fancy-log';
import { deleteAsync } from 'del';

/**
 * Task for wiping the webpack v5 persistent filesystem cache stored in
 * node_modules/.cache/webpack. Useful when a stale cache causes unexpected
 * build output after major config changes or branch switches.
 * Not part of the standard build — run manually via: gulp cleanWebpackCache
 * @return {Promise} Promise resolving when the cache directory has been deleted.
 */
export default async function cleanWebpackCache() {
    return deleteAsync(['node_modules/.cache/webpack'], { force: true })
        .then((deleted) => {
            if (deleted.length) {
                log.info('Webpack filesystem cache cleared.');
            } else {
                log.info('Webpack filesystem cache was already empty.');
            }
        })
        .catch((error) => log.error(error.message));
}
