# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@creativestyle/magesuite-frontend-builder` is the shared Gulp/Webpack build system consumed by all MageSuite child themes via `gulp.registry(registry)`. All actual build logic lives here — themes provide only a minimal `gulpfile.mjs` entry point. Current version: **5.0.0**.

## Commands

```bash
yarn menu           # interactive command menu — recommended starting point
yarn build          # production build
yarn build:verbose  # production build with full asset size report
yarn serve          # development watch mode with BrowserSync
yarn lint           # ESLint + Stylelint
yarn lint:js        # ESLint only (add --fix to auto-fix)
yarn lint:css       # Stylelint only (add --fix to auto-fix)
```

Individual gulp tasks must be run via `yarn gulp <task>` — not bare `gulp` (no global install) and not `yarn <task>` (not in package.json scripts):

```bash
yarn gulp cleanWebpackCache   # wipe webpack filesystem cache
yarn gulp clean               # wipe full dist output
yarn gulp eslint --fix        # lint and auto-fix JS/TS
yarn gulp stylelint --fix     # lint and auto-fix SCSS
```

## Architecture

- **`registry.js`** — entry point, registers all tasks and composes `build`/`serve`/`watch` pipelines
- **`gulp/config/`** — per-task configuration; child themes can override any file by placing a matching file in their own `config/` directory
- **`gulp/tasks/`** — individual gulp task implementations
- **`gulp/environment.js`** — CLI flag parser (`--env`, `--verbose`, `--fix`, `--watch`)
- **`gulp/paths.js`** — resolves `src`/`dist`/`pubStatic` paths from `composer.json`
- **`gulp/collectEntries.js`** — resolves webpack entry points across the theme inheritance chain
- **`gulp/skipUnchangedPlugin.js`** — webpack plugin that skips emitting assets identical to dist

## Key conventions

- **Native ESM** — the builder uses `"type": "module"`. All files use `import`/`export default`. No `require()`.
- **`MagesuiteRegistry`** — ES6 class extending `undertaker-registry`'s `DefaultRegistry`. Themes consume it via `gulp.registry(registry)`.
- **Webpack config overrides** — themes can deep-merge their own `webpack.config.js` into the base config via `webpack-merge`.
- **Task config overrides** — any file in `gulp/config/` can be overridden by placing a matching file in the theme's `config/` directory.
- **`--verbose` flag** — shows full asset sizes and all warnings; default build shows only a concise summary line.

## Intentionally suppressed warnings

### `silenceDeprecations: ['legacy-js-api']` — `gulp/config/buildWebpack.js`

`sass-loader` still uses the old Dart Sass callback-based JS API internally — not a theme code issue. **Remove `legacy-js-api` once sass-loader ships support for the modern async API** — track sass-loader releases.

Other deprecations previously silenced (`import`, `if-function`, `global-builtin`) have been fully resolved in the theme codebase and removed.

### Webpack performance hints suppressed in dev/watch mode

Asset sizes are meaningless before minification; hints would fire on every save during `yarn serve`. Hints are shown correctly in `yarn build` and fully in `yarn build:verbose`.

### SVG optimisation skipped for complex SVGs

svgo v3 crashes on `/* <![CDATA[ */` wrappers in inline `<style>` blocks. Remove CDATA wrappers from custom SVGs to enable optimisation.

## Interactive menu (`magesuite-menu`)

The builder ships a `magesuite-menu` binary (registered via `"bin"` in `package.json`) that presents a grouped, arrow-key navigable menu of all available commands. Powered by `@clack/prompts` (terminal UI) and `@clack/core`'s `SelectPrompt` (unstyled primitive used directly to suppress the default strikethrough rendering on Ctrl+C).

Groups: **Build** → **Lint** (including `--fix` variants) → **Utilities** (`cleanWebpackCache`, `pre-commit`).

Themes add one line to `package.json` scripts to expose it:
```json
"menu": "magesuite-menu"
```

The `pre-commit run --all-files` option requires the `pre-commit` Python tool installed separately (`brew install pre-commit` / `pip install pre-commit`). If not installed, the menu exits cleanly with a "Command not found" message (ENOENT handled via `child.on('error')`).

Commands are spawned via Node.js `child_process.spawn` without `shell: true` to avoid the DEP0190 deprecation warning.

## TypeScript compilation pipeline

- **`ts-loader` with `transpileOnly: true`** — strips types and emits JS; no type checking during `yarn build`. Build always succeeds regardless of type errors.
- **`tsc --noEmit`** — type checking only, run by `yarn lint:js`. `noEmit: true` means no files are written, but the `target` in `tsconfig.json` still matters because `ts-loader` reads it to determine output syntax.
- **tsconfig `target: "ES2022"`** — matches `.browserslistrc` (no IE 11, last 2 versions of evergreen browsers). ES2022 is natively supported by all targeted browsers; no downcompilation needed.
- **Pre-commit hook runs ESLint only** — `tsc` is deliberately excluded to keep commits fast. Type errors only surface via `yarn lint:js` or CI.

## ESLint rules — enabled as warn

In addition to the rules kept off below, the following are **enabled as `warn`** — enforced best practices for all consuming themes:

- **`object-shorthand`** — `{ method() {} }` / `{ key }` over `{ method: function() {} }` / `{ key: key }`
- **`prefer-arrow-callback`** — arrow functions for callbacks unless `this` binding is required
- **`@typescript-eslint/no-unused-expressions`** (`allowTernary: true`, `allowShortCircuit: true`) — no discarded expression results; ternaries (`condition ? doA() : doB()`) and short-circuit patterns (`condition && doSomething()`) as statements permitted; bare property reads are not
- **`@typescript-eslint/no-empty-function`** — no accidentally empty function bodies
- **`no-console`** (`allow: ['warn', 'error']`) — `console.log` flagged; `console.warn`/`console.error` allowed

### ESLint rules kept off

- **`@typescript-eslint/no-explicit-any`** — widespread `any` usage in the theme; gradually replace with proper types in new/modified code
- **`@typescript-eslint/no-var-requires`** — not applicable to ESM builder; kept off for any theme files still using `require()` patterns

## Theme integration

```js
import gulp from 'gulp';
import registry from '@creativestyle/magesuite-frontend-builder';
gulp.registry(registry);
```
