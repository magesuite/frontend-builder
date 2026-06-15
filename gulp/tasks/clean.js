import log from 'fancy-log';
import { deleteAsync } from 'del';

import settings from '../config/clean.js';

/**
 * Task for deleting the dist directory before a fresh build.
 * Paths to clean are defined in gulp/config/clean.js.
 * @return {Promise} Promise resolving when all configured paths have been deleted.
 */
export default async function clean() {
    return deleteAsync(settings.src, {
        force: true,
    }).catch((error) => log.error(error.message));
}
