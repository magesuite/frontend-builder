# @creativestyle/magesuite-frontend-builder

A modern build system for Magento 2 / MageSuite themes built on **Webpack 5**, **TypeScript**, and **Gulp 5**. Provides webpack bundling, SCSS compilation, asset copying, image optimisation, linting, BrowserSync dev proxy, and Magento cache management — all wired together in a single package consumed by child themes.

---

## Features

- **Webpack 5** with TypeScript compilation and persistent filesystem cache
- **Hot CSS injection** via BrowserSync — no page reloads for style changes
- **Multi-level theme inheritance** — file resolution walks the full `theme.xml` parent chain
- **Modern tooling** — ESLint flat config, Stylelint v17, Prettier, Husky v9, lint-staged
- **Interactive command menu** — `yarn menu` for arrow-key navigation of all available tasks
- **Production optimisation** — CSS minification, image compression, WOFF2-only fonts

---

## Quick start

```bash
yarn install

yarn menu           # interactive command menu — recommended starting point
yarn build          # production build
yarn build:verbose  # production build with full asset size report
yarn serve          # development watch mode with BrowserSync
yarn lint           # ESLint + Stylelint
yarn lint:js        # ESLint only
yarn lint:css       # Stylelint only
```

Individual gulp tasks can also be run directly. Use `yarn gulp <task>` — not bare `gulp <task>` (no global install) and not `yarn <task>` (these tasks are not listed in `package.json` scripts):

```bash
yarn gulp cleanWebpackCache   # wipe webpack filesystem cache
yarn gulp eslint --fix        # lint and auto-fix JS/TS
yarn gulp stylelint --fix     # lint and auto-fix SCSS
```

---

## Directory structure

```
magesuite-frontend-builder/
├── registry.js                 # Entry point — registers all tasks and composes build/serve/watch
├── menu.js                     # Interactive CLI menu binary (magesuite-menu)
├── eslint.config.js            # ESLint flat config (JS + TS, Prettier integration)
├── package.json
│
├── config/                     # Theme-level config files re-exported by child themes
│   ├── lint-staged.js          # lint-staged config — runs ESLint + Stylelint on staged files
│   ├── prettier.js             # Prettier config
│   └── stylelint.js            # Stylelint config
│
└── gulp/
    ├── environment.js          # CLI flag parser — development / production / ci / watch / verbose
    ├── paths.js                # Resolved src/dist/pubStatic paths from composer.json
    ├── collectEntries.js       # Resolves webpack entry points across theme inheritance chain
    ├── collectParents.js       # Walks theme.xml <parent> chain → ordered list of parent paths
    ├── parentAliases.js        # Builds webpack alias map (e.g. Creativeshop → parent src/)
    ├── skipUnchangedPlugin.js  # Webpack plugin — skips emitting assets identical to dist
    ├── srcExists.js            # Guards gulp.src() calls — prevents ENOENT when optional dirs are absent
    │
    ├── config/                 # Per-task configuration
    │   ├── browserSync.js      # BrowserSync proxy settings and all rewrite middleware
    │   ├── buildSprites.js     # SVG sprite generation settings
    │   ├── buildWebpack.js     # Full webpack configuration (entries, loaders, plugins, cache)
    │   ├── clean.js            # Paths deleted by the clean task
    │   ├── cleanCache.js       # Magento cache types + connection config (ssh/local/docker)
    │   ├── collectViewXml.js   # Source paths for view.xml collection
    │   ├── copyDocs.js         # Glob patterns for documentation assets
    │   ├── copyHtml.js         # Glob patterns for HTML templates
    │   ├── copyImages.js       # Glob patterns + imagemin plugin options
    │   ├── copyScripts.js      # Glob patterns for plain JS vendor scripts
    │   └── copyUnchanged.js    # Glob patterns for all other static assets
    │
    └── tasks/                  # Individual gulp task implementations
        ├── browserSync.js
        ├── buildWebpack.js
        ├── clean.js
        ├── cleanCache.js
        ├── cleanWebpackCache.js
        ├── collectViewXml.js
        ├── copyDocs.js
        ├── copyHtml.js
        ├── copyImages.js
        ├── copyScripts.js
        ├── copyUnchanged.js
        ├── eslint.js
        ├── generateCerts.js
        └── stylelint.js
```

---

## Theme inheritance system

The builder supports multi-level theme inheritance. File resolution walks the full `theme.xml` parent chain at build time:

```
theme-creativeshop  (base)
└── theme-child
    └── theme-grandchild
```

Resolution order for any given file:
1. Current theme `src/`
2. Parent theme `src/`
3. Base theme `src/` (theme-creativeshop)
4. `node_modules/`

Webpack aliases and SCSS `includePaths` are populated automatically from this chain — no manual path configuration needed in child themes.

### Parent theme setup

Each theme declares its parent in `src/theme.xml`:

```xml
<theme xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/theme.xsd">
    <title>Child Theme</title>
    <parent>Creativestyle/theme-creativeshop</parent>
</theme>
```

The builder reads this file to build the alias map and resolve entry points across all levels of the chain.

---

## Theme integration

Themes consume the builder via `gulpfile.mjs`:

```js
import gulp from 'gulp';
import registry from '@creativestyle/magesuite-frontend-builder';
gulp.registry(registry);
```

To override webpack config, add a `webpack.config.js` to your theme root — it will be deep-merged with the base config via `webpack-merge`.

### Child theme `package.json`

```json
{
    "scripts": {
        "menu":         "magesuite-menu",
        "build":        "gulp build --env production",
        "build:verbose":"gulp build --env production --verbose",
        "serve":        "gulp serve",
        "start":        "gulp serve",
        "lint:js":      "gulp eslint",
        "lint:css":     "gulp stylelint",
        "lint":         "gulp eslint && gulp stylelint",
        "prepare":      "husky"
    },
    "resolutions": {
        "caniuse-lite": "^1.0.30001781"
    }
}
```

### Child theme `tsconfig.json`

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "commonjs",
        "moduleResolution": "node",
        "noEmit": true,
        "skipLibCheck": true,
        "paths": {
            "*": ["./src/*", "./node_modules/*", "../theme-creativeshop/src/*"]
        }
    }
}
```

### Child theme `src/declarations.d.ts`

```typescript
declare module '*.scss';
declare module 'mage/*';
```

TypeScript has no built-in understanding of SCSS imports or Magento's RequireJS modules, so without this file `tsc` (and the ESLint TypeScript parser) would error on:

- `import '*.scss'` — theme TS files often import SCSS; TypeScript treats unknown extensions as missing modules.
- `import ... from 'mage/translate'` etc. — Magento core ships no `.d.ts` files, so all `mage/*` imports are unresolved types.

The file suppresses both classes of errors globally without touching any theme source file.

---

## Development workflow

### Starting development

```bash
# Install dependencies
yarn install

# Start the development server
yarn serve
```

BrowserSync starts a reverse proxy in front of Magento. CSS changes are injected without a page reload; JS changes trigger a reload. SSL is handled automatically via mkcert — see [LOCAL_SSL_CERT.md](./LOCAL_SSL_CERT.md).

### Production build

```bash
yarn build          # concise summary output
yarn build:verbose  # full asset list with sizes and all warnings
```

### Linting

```bash
yarn lint           # ESLint + Stylelint
yarn lint:js        # ESLint + tsc --noEmit
yarn lint:css       # Stylelint

# Auto-fix formatting and fixable violations
yarn gulp eslint --fix
yarn gulp stylelint --fix
```

The pre-commit hook (Husky + lint-staged) runs ESLint and Stylelint automatically on staged files before every commit.

---

## Interactive menu

`yarn menu` opens an arrow-key navigable launcher with per-item descriptions. No need to remember command names.

### Adding to a theme

```json
"scripts": {
    "menu": "magesuite-menu"
}
```

The binary is wired up automatically via the `bin` field in the builder's `package.json`.

### Menu groups

| Group | Commands |
|---|---|
| **Build** | `build`, `build:verbose`, `serve` |
| **Lint** | `lint`, `lint:js`, `lint:css`, `lint --fix`, `lint:js --fix`, `lint:css --fix` |
| **Utilities** | `cleanWebpackCache`, `pre-commit` |

---

## TypeScript compilation pipeline

TypeScript is compiled by **`ts-loader`** inside Webpack with `transpileOnly: true` — strips types and emits JavaScript but skips type checking. This keeps build times fast.

Type checking is handled separately by **`tsc --noEmit`**, which runs alongside ESLint during `yarn lint:js`:

```
yarn build    → Webpack + ts-loader (transpileOnly: true) → fast, no type errors surfaced
yarn lint:js  → tsc --noEmit + ESLint                    → type errors and lint violations reported
```

The pre-commit hook runs **ESLint on staged files only** — not `tsc`. Type errors do not block commits; they surface via `yarn lint:js` or CI.

---

## `resolutions` — caniuse-lite

Add a `resolutions` field to the child theme's `package.json`:

```json
"resolutions": {
    "caniuse-lite": "^1.0.30001781"
}
```

`caniuse-api` (a transitive dependency of autoprefixer) declares `caniuse-lite@^1.0.0` — a loose range that resolves to a stale version, triggering "browsers data is N months old" warnings on every build. The `resolutions` field collapses all nested `caniuse-lite` entries to a single up-to-date version in `yarn.lock`.

Run `yarn install --force` after adding the field to apply the resolution.

---

## Package reference

### Build orchestration

| Package | Purpose |
|---|---|
| `gulp` v5 | Task runner and pipeline orchestrator |
| `undertaker-registry` | Allows themes to consume all tasks via `gulp.registry()` |
| `yargs` | CLI argument parsing (`--env`, `--verbose`, `--fix`, `--watch`) |
| `fancy-log` | Timestamped console output used across all tasks |
| `plugin-error` | Structured gulp error objects for task failure reporting |
| `chalk` | Terminal colour output — used in build banner and warning messages |

### Webpack and JS bundling

| Package | Purpose |
|---|---|
| `webpack` v5 | Module bundler — compiles TypeScript entry points, bundles SCSS |
| `webpack-merge` v6 | Deep-merges child theme `webpack.config.js` overrides into base config |
| `ts-loader` | Webpack loader for TypeScript transpilation (`transpileOnly` mode) |
| `typescript` | TypeScript compiler (used by ts-loader) |
| `@types/jquery` | Type definitions for jQuery (available globally in Magento) |
| `@types/requirejs` | Type definitions for RequireJS (used in Magento module overrides) |
| `glob` v11 | Resolves entry point file patterns across the theme inheritance chain |

### CSS processing

| Package | Purpose |
|---|---|
| `sass` | Dart Sass compiler — compiles SCSS to CSS |
| `sass-loader` v16 | Webpack loader that invokes Dart Sass |
| `css-loader` v7 | Resolves CSS `@import` and `url()` inside webpack |
| `mini-css-extract-plugin` | Extracts compiled CSS into separate `.css` files per entry point |
| `css-minimizer-webpack-plugin` | Minifies extracted CSS in production builds |
| `postcss-loader` v8 | Runs PostCSS plugins on compiled CSS |
| `autoprefixer` | PostCSS plugin — adds vendor prefixes based on Browserslist targets |
| `postcss-flexbugs-fixes` | PostCSS plugin — patches known flexbox bugs across browsers |

### Asset handling

| Package | Purpose |
|---|---|
| `gulp-changed` | Skips copying files that haven't changed since the last build |
| `gulp-imagemin` v9 | Image optimisation pipeline (production only) |
| `imagemin-mozjpeg` v10 | Lossy JPEG compression via mozjpeg |
| `imagemin-pngquant` v10 | Lossy PNG compression via pngquant |
| `imagemin-svgo` v10 | SVG optimisation via svgo v3 |
| `del` v8 | Deletes files and directories |

### Linting and formatting

| Package | Purpose |
|---|---|
| `eslint` v10 | JavaScript and TypeScript linter — flat config format (`eslint.config.js`) |
| `@eslint/js` | ESLint's built-in recommended JS rule set |
| `typescript-eslint` | TypeScript-aware lint rules and TS parser |
| `prettier` | Opinionated code formatter — enforced via ESLint and Stylelint |
| `eslint-config-prettier` | Disables ESLint formatting rules that conflict with Prettier |
| `eslint-plugin-prettier` | Runs Prettier as an ESLint rule |
| `stylelint` v17 | SCSS linter |
| `stylelint-scss` | SCSS-specific lint rules |
| `stylelint-config-recommended-scss` | Recommended rules for SCSS |
| `stylelint-prettier` | Runs Prettier as a Stylelint rule |
| `postcss-scss` | PostCSS syntax for parsing SCSS (required by Stylelint) |

### Interactive menu

| Package | Purpose |
|---|---|
| `@clack/prompts` | Terminal UI components — `intro`, `outro`, `select`, `log` |
| `@clack/core` | Unstyled prompt primitives — `SelectPrompt` used for custom Ctrl+C cancel behaviour |

### Git hooks

| Package | Purpose |
|---|---|
| `husky` v9 | Manages git hooks — runs lint-staged on pre-commit |
| `lint-staged` v16 | Runs linters only on staged files |

---

## What changed in v5.0 vs v4.x

### Adopted

| Area | Change |
|---|---|
| **Webpack v5** | Replaced webpack v4. Built-in filesystem cache replaces `cache-loader` — faster incremental builds |
| **CSS minification** | `css-minimizer-webpack-plugin` replaces deprecated `optimize-css-assets-webpack-plugin` |
| **Native ESM** | Builder converted from CJS to native ES modules (`"type": "module"`). All `require()` / `module.exports` replaced with `import` / `export default` |
| **ESM packages** | `del`, `glob`, `gulp`, `gulp-imagemin`, `imagemin-*` are ESM-only; now imported statically |
| **`MagesuiteRegistry` class** | Modernised from ES5 `util.inherits` + prototype pattern to ES6 `class extends DefaultRegistry` |
| **ESLint v10 flat config** | Migrated from `.eslintrc.js` legacy config to `eslint.config.js` flat config format |
| **Dart Sass 1.x** | `sass-loader` v16 auto-detects Dart Sass; `implementation: sass` option removed |
| **BrowserSync v3** | Full HTTPS proxy with URL rewriting, cookie domain fixes, CSP stripping, and POST body rewriting for Magento link masking compatibility |
| **Verbose build output** | `--verbose` flag shows full asset sizes and warnings; default build shows only a concise summary line |
| **Interactive menu** | `magesuite-menu` binary — arrow-key navigable command launcher |

### Intentionally suppressed — and why

| Suppression | Reason | Should devs adapt? |
|---|---|---|
| **Sass deprecations** (`legacy-js-api`, `import`, `global-builtin`, `slash-div`, `color-functions`, `if-function`) | `legacy-js-api`: sass-loader still uses the old Dart Sass callback-based JS API. The remaining five allow themes that have not yet migrated to `@use`/`@forward` to compile cleanly. | Remove the five `@import` entries once all themes are migrated via `mgs-migrate-sass`. Remove `legacy-js-api` once sass-loader ships modern async API support. |
| **Webpack performance hints** in dev/watch mode | Asset sizes are meaningless before minification | No — hints are shown correctly in `yarn build` and fully in `yarn build:verbose` |
| **SVG optimisation via svgo** for complex SVGs | svgo v3 crashes on `/* <![CDATA[ */` wrappers in inline `<style>` blocks | **Yes** — remove CDATA wrappers from custom SVGs |
| **`imagemin-gifsicle`** dropped entirely | Binary installer incompatible with Node 18+; package unmaintained since 2019 | No — GIF assets are copied unoptimised |
| **`@typescript-eslint/no-explicit-any`** off | Theme codebase has widespread `any` usage | **Yes** — gradually replace `any` with proper types in new code |

---

## Troubleshooting

### CSS not injecting via BrowserSync

- Verify you are accessing the BrowserSync URL (with port), not the Magento URL directly
- Check the proxy target in `gulp/config/browserSync.js` matches your local domain
- Ensure CSS files are being generated in the correct `web/css/` directory

### "Module not found" errors

- Check `tsconfig.json` `paths` — the parent theme path must match the actual relative location
- Verify the parent theme is present at `vendor/creativestyle/<parent-theme>/`
- Run `yarn install` to ensure all builder dependencies are installed

### Stale webpack cache after branch switch

```bash
yarn gulp cleanWebpackCache
```

Run this after switching branches with major config differences or after changing webpack aliases — the persistent cache does not detect alias changes automatically.

### `[DEP0060] util._extend` deprecation during `yarn serve`

**Cause:** BrowserSync depends on `http-proxy` (unmaintained since 2020) which uses the deprecated `util._extend` API. Surfaces on Node.js 22+.

**Impact:** None — `yarn serve` works correctly. Cosmetic noise only. Open upstream: [BrowserSync issue #2091](https://github.com/BrowserSync/browser-sync/issues/2091).

---

## Further reading

- [CHANGELOG.md](./CHANGELOG.md) — version history
- [LOCAL_SSL_CERT.md](./LOCAL_SSL_CERT.md) — setting up local HTTPS for BrowserSync
