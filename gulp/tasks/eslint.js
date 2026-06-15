import { ESLint } from 'eslint';
import PluginError from 'plugin-error';
import log from 'fancy-log';
import yargs from 'yargs/yargs';

const argv = yargs(process.argv.slice(2)).parseSync();

/**
 * Task for linting TypeScript and JavaScript source files using ESLint.
 * Runs against src/**\/*.{ts,js} using the flat config in eslint.config.js.
 * Pass --fix to auto-fix violations: gulp eslint --fix
 * @return {Promise} Promise rejecting with a PluginError if any lint errors are found.
 */
export default async function eslint() {
    const fix = Boolean(argv.fix);
    const instance = new ESLint({ fix });
    const results = await instance.lintFiles(['src/**/*.{ts,js}']);

    if (fix) {
        await ESLint.outputFixes(results);
    }

    const formatter = await instance.loadFormatter('stylish');
    const output = await formatter.format(results);

    if (output) {
        log(output);
    }

    const errorCount = results.reduce((sum, r) => sum + r.errorCount, 0);

    if (errorCount > 0) {
        throw new PluginError('eslint', `ESLint found ${errorCount} error(s).`);
    }
}
