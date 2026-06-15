#!/usr/bin/env node
/**
 * MageSuite interactive CLI menu.
 *
 * Themes invoke this via their package.json:
 *   "menu": "node node_modules/@creativestyle/magesuite-frontend-builder/menu.js"
 *
 * Uses a custom select built on @clack/core to suppress the strikethrough
 * rendering of the highlighted item on Ctrl+C cancellation.
 */
import { SelectPrompt, wrapTextWithPrefix } from '@clack/core';
import {
    intro,
    outro,
    isCancel,
    log,
    symbol,
    symbolBar,
    limitOptions,
    settings,
    S_BAR,
    S_BAR_END,
    S_RADIO_ACTIVE,
    S_RADIO_INACTIVE,
} from '@clack/prompts';
import { styleText } from 'node:util';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const builderPkg = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);
const themePkg = JSON.parse(
    readFileSync(join(process.cwd(), 'package.json'), 'utf8')
);
const scripts = themePkg.scripts ?? {};

function exec(cmd, args = []) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: 'inherit' });
        child.on('close', (code) => {
            code === 0 ? resolve() : reject(code);
        });
        child.on('error', (err) => {
            if (err.code === 'ENOENT') {
                reject(new Error(`Command not found: ${cmd} — is it installed?`));
            } else {
                reject(err);
            }
        });
    });
}

function run(...args) {
    return exec('yarn', ['--silent', ...args]);
}

function customSelect({ message, options, initialValue }) {
    const renderOption = (option, state) => {
        const label = option.label ?? String(option.value);
        const hint = option.hint ? ` ${styleText('dim', `(${option.hint})`)}` : '';
        switch (state) {
            case 'disabled':
                return `${styleText('gray', S_RADIO_INACTIVE)} ${styleText('gray', label)}`;
            case 'selected':
                return styleText('dim', label);
            case 'active':
                return `${styleText('cyan', S_RADIO_ACTIVE)} ${label}${hint}`;
            default:
                return `${styleText('dim', S_RADIO_INACTIVE)} ${styleText('dim', label)}`;
        }
    };

    return new SelectPrompt({
        options,
        initialValue,
        render() {
            const withGuide = settings.withGuide;
            const statePrefix = `${symbol(this.state)}  `;
            const barPrefix = `${symbolBar(this.state)}  `;
            const wrappedMessage = wrapTextWithPrefix(
                process.stdout,
                message,
                barPrefix,
                statePrefix
            );
            const header = `${withGuide ? `${styleText('gray', S_BAR)}\n` : ''}${wrappedMessage}`;

            switch (this.state) {
                case 'submit': {
                    const pad = withGuide ? `${styleText('gray', S_BAR)}  ` : '';
                    const selected = wrapTextWithPrefix(
                        process.stdout,
                        renderOption(this.options[this.cursor], 'selected'),
                        pad
                    );
                    return `${header}${selected}`;
                }
                case 'cancel': {
                    return header;
                }
                default: {
                    const visible = limitOptions({
                        cursor: this.cursor,
                        options: this.options,
                        output: process.stdout,
                        style: (opt, active) =>
                            renderOption(
                                opt,
                                opt.disabled ? 'disabled' : active ? 'active' : 'inactive'
                            ),
                    });
                    const bar = `${styleText('gray', S_BAR)}  `;
                    const items = visible.map((item) => `${bar}${item}`).join('\n');
                    return `${header}\n${items}\n${styleText('gray', S_BAR_END)}`;
                }
            }
        },
    }).prompt();
}

const sep = (label) => ({ value: `__sep_${label}`, label, hint: '', disabled: true });

const options = [
    sep('── Build ───────────────────────'),
    scripts.build && {
        value: 'build',
        label: 'build',
        hint: 'full production build',
        action: () => run('build'),
    },
    scripts['build:verbose'] && {
        value: 'build:verbose',
        label: 'build:verbose',
        hint: 'production build with verbose webpack output',
        action: () => run('build:verbose'),
    },
    scripts.serve && {
        value: 'serve',
        label: 'serve',
        hint: 'development mode — BrowserSync + file watching',
        action: () => run('serve'),
    },
    sep('── Lint ────────────────────────'),
    scripts.lint && {
        value: 'lint',
        label: 'lint',
        hint: 'report ESLint + Stylelint violations',
        action: () => run('lint'),
    },
    scripts['lint:js'] && {
        value: 'lint:js',
        label: 'lint:js',
        hint: 'report ESLint violations in JS/TS files',
        action: () => run('lint:js'),
    },
    scripts['lint:css'] && {
        value: 'lint:css',
        label: 'lint:css',
        hint: 'report Stylelint violations in SCSS files',
        action: () => run('lint:css'),
    },
    scripts.lint && {
        value: 'lint:fix',
        label: 'lint --fix',
        hint: 'auto-fix all ESLint + Stylelint violations',
        action: async () => {
            await run('gulp', 'eslint', '--fix');
            await run('gulp', 'stylelint', '--fix');
        },
    },
    scripts['lint:js'] && {
        value: 'lint:js:fix',
        label: 'lint:js --fix',
        hint: 'auto-fix ESLint violations in JS/TS files',
        action: () => run('gulp', 'eslint', '--fix'),
    },
    scripts['lint:css'] && {
        value: 'lint:css:fix',
        label: 'lint:css --fix',
        hint: 'auto-fix Stylelint violations in SCSS files',
        action: () => run('gulp', 'stylelint', '--fix'),
    },
    sep('── Utilities ───────────────────'),
    {
        value: 'cleanWebpackCache',
        label: 'cleanWebpackCache',
        hint: 'remove cached webpack build artifacts',
        action: () => run('gulp', 'cleanWebpackCache'),
    },
    {
        value: 'pre-commit',
        label: 'pre-commit',
        hint: 'run all pre-commit hooks — requires: pip install pre-commit && pre-commit install',
        action: () => exec('pre-commit', ['run', '--all-files']),
    },
].filter(Boolean);

intro(`MageSuite Frontend Builder  v${builderPkg.version}`);

const command = await customSelect({
    message: 'What would you like to do?  ·  Ctrl+C to exit',
    options,
});

if (isCancel(command)) {
    outro('Bye.');
    process.exit(0);
}

const selected = options.find((o) => o.value === command);

log.step(`Running ${selected.label}…`);
process.stdout.write('\n');

try {
    await selected.action();
} catch (err) {
    if (err instanceof Error) log.error(err.message);
    outro('Command failed.');
    process.exit(0);
}
