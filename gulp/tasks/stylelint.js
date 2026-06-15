import stylelint from 'stylelint';
import PluginError from 'plugin-error';
import log from 'fancy-log';
import yargs from 'yargs/yargs';

const argv = yargs(process.argv.slice(2)).parseSync();

/**
 * Task for linting SCSS source files using Stylelint.
 * Runs against src/**\/*.scss using the config in .stylelintrc.js.
 * Pass --fix to auto-fix violations: gulp stylelint --fix
 * @return {Promise} Promise rejecting with a PluginError if any lint errors are found.
 */
export default async function stylelint_task() {
    const fix = Boolean(argv.fix);
    const result = await stylelint.lint({
        files: ['src/**/*.scss'],
        formatter: 'string',
        fix,
    });

    if (result.report) {
        log(result.report);
    }

    if (result.errored) {
        throw new PluginError('stylelint', 'Stylelint found errors.');
    }
}
