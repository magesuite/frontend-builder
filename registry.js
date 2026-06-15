/**
 * MageSuite Gulp task registry — entry point for the frontend builder.
 *
 * Registers all individual tasks with Undertaker and composes them into the
 * three top-level workflows consumed by themes:
 *
 *   gulp build  — full production build:
 *                 clean → collectViewXml → (buildWebpack + copy tasks in parallel) → cleanCache
 *
 *   gulp serve  — development watch mode:
 *                 enables watch flag → build → generateCerts → browserSync
 *
 *   gulp watch  — same as serve but without BrowserSync (rarely used directly)
 *
 * Individual tasks can also be run standalone, e.g.:
 *   gulp eslint [--fix]
 *   gulp stylelint [--fix]
 *   gulp cleanWebpackCache
 *
 * Themes consume this registry via their gulpfile.mjs:
 *   import registry from '@creativestyle/magesuite-frontend-builder';
 *   gulp.registry(registry);
 */
import { readFileSync } from 'fs';
import chalk from 'chalk';
import DefaultRegistry from 'undertaker-registry';

import environment from './gulp/environment.js';

// --- Build tasks ---
import buildWebpack from './gulp/tasks/buildWebpack.js';

// --- Asset copy tasks ---
import copyDocs from './gulp/tasks/copyDocs.js';
import copyHtml from './gulp/tasks/copyHtml.js';
import copyImages from './gulp/tasks/copyImages.js';
import copyScripts from './gulp/tasks/copyScripts.js';
import copyUnchanged from './gulp/tasks/copyUnchanged.js';

// --- View XML collection ---
import collectViewXml from './gulp/tasks/collectViewXml.js';

// --- Utility tasks ---
import clean from './gulp/tasks/clean.js';
import cleanCache from './gulp/tasks/cleanCache.js';
import cleanWebpackCache from './gulp/tasks/cleanWebpackCache.js';
import generateCerts from './gulp/tasks/generateCerts.js';
import browserSyncTask from './gulp/tasks/browserSync.js';
import eslintTask from './gulp/tasks/eslint.js';
import stylelintTask from './gulp/tasks/stylelint.js';

const { version } = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

function printBanner() {
    const env = environment.production ? 'production' : 'development';
    const titleSuffix = ` Frontend Builder v${version}`;
    const title = `MageSuite${titleSuffix}`;
    const envLine = `Environment: ${env}`;
    const W = Math.max(title.length, envLine.length) + 2;
    const bar = '═'.repeat(W + 2);
    const row = (text, color) =>
        chalk.magenta('  ║') +
        chalk[color](' ' + text + ' '.repeat(W - text.length) + ' ') +
        chalk.magenta('║');
    const mixedRow = (label, rest) =>
        chalk.magenta('  ║') +
        chalk.magenta(' ' + label) +
        chalk.white(rest + ' '.repeat(W - title.length) + ' ') +
        chalk.magenta('║');

    console.log('');
    console.log(chalk.magenta('  ╔' + bar + '╗'));
    console.log(mixedRow('MageSuite', titleSuffix));
    console.log(row(envLine, 'white'));
    console.log(chalk.magenta('  ╚' + bar + '╝'));
    console.log('');
}

class MagesuiteRegistry extends DefaultRegistry {
    constructor() {
        super();
        const task = process.argv.slice(2).find((a) => !a.startsWith('-'));
        if (task === 'build' || task === 'serve') {
            printBanner();
        }
    }

    init(taker) {
        // --- Build tasks ---
        taker.task(buildWebpack);

        // --- Asset copy tasks ---
        taker.task(copyDocs);
        taker.task(copyHtml);
        taker.task(copyImages);
        taker.task(copyScripts);
        taker.task(copyUnchanged);

        // --- View XML collection ---
        taker.task(collectViewXml);

        // --- Utility tasks ---
        taker.task(clean);
        taker.task(cleanCache);
        taker.task(cleanWebpackCache);
        taker.task(generateCerts);
        taker.task(browserSyncTask);
        taker.task(eslintTask);
        taker.task('stylelint', stylelintTask);

        // --- Composed workflows ---
        taker.task(
            'build',
            taker.series(
                'clean',
                'collectViewXml',
                taker.parallel(
                    'buildWebpack',
                    'copyDocs',
                    'copyHtml',
                    'copyScripts',
                    'copyImages',
                    'copyUnchanged'
                ),
                'cleanCache'
            )
        );

        taker.task(
            'watch',
            taker.series(function enableWatch(done) {
                environment.watch = true;
                done();
            }, 'build')
        );

        taker.task(
            'serve',
            taker.series('watch', 'generateCerts', 'browserSync')
        );
    }
}

export default new MagesuiteRegistry();
