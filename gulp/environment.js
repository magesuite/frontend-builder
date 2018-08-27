const argv = require('yargs').argv;

/**
 * Module responsible for defining custom environments for project building.
 * You can set them using "--env" option for every task e.g. "gulp compile --env production".
 */

const environment = {
    // Dev environment, without unnecessary optimizations.
    development: false,
    // Production environment, files from this mode land on production server.
    production: false,
    // CI environment, same as production but with custom reporting.
    ci: false,
    // Special watch environment, disables breaking build on errors.
    watch: Boolean(argv.w) || Boolean(argv.watch),
};

// Check "--env" task param.
switch (argv.env) {
    case 'ci':
        environment.ci = true;
        environment.production = true;
        break;

    case 'production':
        environment.production = true;
        break;

    default:
        environment.development = true;
}

module.exports = environment;
