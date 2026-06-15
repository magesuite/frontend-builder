# Migration Guide: Frontend Builder v4 → v5

This guide covers migrating existing MageSuite child themes from Frontend Builder v4 to v5.

---

## What changes

- `gulpfile.js` → `gulpfile.mjs` (ESM)
- Husky v4 (`.huskyrc.js`) → Husky v9 (`.husky/pre-commit`)
- `.eslintrc.js` / `.stylelintrc.js` / `.prettierrc.js` → `eslint.config.mjs` / `stylelint.config.mjs` / `.prettierrc.mjs` (flat config, re-exports from builder)
- `tsconfig.json` updated: `ES2022` target, `baseUrl` removed, `skipLibCheck` added
- `src/declarations.d.ts` added (SCSS and Magento module type declarations)
- `package.json` scripts synced: `menu`, `build:verbose`, `lint:js`, `lint:css`, `prepare` added
- `caniuse-lite` resolution added to silence stale browser data warnings
- WOFF1 font fallbacks dropped — WOFF2 only
- SVG `<![CDATA[` wrappers removed (svgo v3 crashes on them)
- Old config files deleted: `tslint.js`, `gulpfile.js`, `.huskyrc.js`, `.prettierrc.js`, `.stylelintrc.js`

The theme's SCSS, JS, and TS source files are **not modified**. If the theme still uses `@import`-based SCSS, the builder silences the relevant Dart Sass deprecations so everything compiles cleanly. SCSS migration (`@import` → `@use`/`@forward`) is a separate step.

---

## Automated migration (recommended)

The migration is fully automated via the **`mgs-migrate-builder`** Claude Code skill. It handles all phases — environment setup, tooling replacement, asset cleanup, and build/lint verification — without modifying any SCSS, JS, or TS files.

### Prerequisites

- Claude Code installed and available in your terminal
- The `ai-tools` repository present at `vendor/creativestyle/ai-tools/` in the Magento project root
- `theme-creativeshop` already migrated to v5 (the skill checks this and stops if not)
- A feature branch created in the child theme (the skill will create one if needed)

### Running the migration

From the Magento project root:

```bash
claude
```

Then invoke the skill:

```
/mgs-migrate-builder
```

The skill reads `PROJECT.md` to identify the theme, walks you through the full migration interactively, and commits the result with a descriptive commit message.

### What the skill does

- **Phase 1** — Verifies the inheritance chain, confirms the theme is on a feature branch, locates `theme-creativeshop`, and installs the builder (via yalc if a local copy is present, otherwise from npm)
- **Phase 2** — Runs `setup-tooling.mjs`: replaces all config files, syncs `package.json` scripts, removes `include-media` dependency, adds `caniuse-lite` resolution
- **Phase 3** — Drops WOFF1 font files and preload entries, removes SVG CDATA wrappers, updates custom `webpack.config.js` if present
- **Phase 4** — Runs `yarn build`, `yarn lint:css`, `yarn lint:js` — all must pass with zero errors. `prettier/prettier` violations are fixed automatically with `prettier --write`; any other unexpected error is reported to you for a decision

---

## Manual migration

All commands run from the child theme root unless noted otherwise.

---

### Step 1 — install the builder

Add `@creativestyle/magesuite-frontend-builder` v5 to `devDependencies` (or link via yalc if using a local copy):

```bash
yarn add --dev @creativestyle/magesuite-frontend-builder@^5.0.0
yarn install && yarn upgrade
```

If `yarn upgrade` fails with "Outdated lockfile", run `yarn install --force` instead.

---

### Step 2 — delete legacy config files

```bash
rm -f gulpfile.js .huskyrc.js .prettierrc.js .stylelintrc.js tslint.js
rm -f eslint.js .eslintrc.js .eslintrc
```

Old config files override the builder's settings — they must be deleted before creating replacements.

---

### Step 3 — create new config files

**`gulpfile.mjs`**

```js
import gulp from 'gulp';
import registry from '@creativestyle/magesuite-frontend-builder';
gulp.registry(registry);
```

**`eslint.config.mjs`**

```js
import config from '@creativestyle/magesuite-frontend-builder/eslint.config.js';
export default config;
```

If the theme has `.js` files using `define()` (AMD pattern) outside `src/web/`, `src/Magento_*`, or vendor directories, add AMD globals:

```js
import config from '@creativestyle/magesuite-frontend-builder/eslint.config.js';
export default [
    ...config,
    {
        languageOptions: {
            globals: {
                define: false,
                require: false,
            },
        },
    },
];
```

**`stylelint.config.mjs`**

```js
import config from '@creativestyle/magesuite-frontend-builder/config/stylelint.js';
export default config;
```

**`.prettierrc.mjs`**

```js
import config from '@creativestyle/magesuite-frontend-builder/config/prettier.js';
export default config;
```

**`.husky/pre-commit`** (create directory first: `mkdir -p .husky`)

```sh
#!/bin/sh
npx lint-staged -c node_modules/@creativestyle/magesuite-frontend-builder/config/lint-staged.js
```

Make it executable: `chmod +x .husky/pre-commit`

**`src/declarations.d.ts`** (new file)

```typescript
declare module '*.scss';
declare module 'mage/*';
```

---

### Step 4 — update `tsconfig.json`

Replace with:

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

Key changes from v4: `target` ES5 → ES2022, `baseUrl` removed, `skipLibCheck` added, `./` prefix added to `paths` entries.

---

### Step 5 — update `package.json`

Add or update scripts:

```json
"scripts": {
    "menu":          "magesuite-menu",
    "build":         "gulp build --env production",
    "build:verbose": "gulp build --env production --verbose",
    "serve":         "gulp serve",
    "start":         "gulp serve",
    "lint:js":       "gulp eslint",
    "lint:css":      "gulp stylelint",
    "lint":          "gulp eslint && gulp stylelint",
    "prepare":       "husky"
}
```

Do not replace the entire `scripts` object — preserve any project-specific scripts.

Remove `include-media` from `dependencies` if present — child themes inherit `media()` from theme-creativeshop.

Add a `resolutions` field to silence stale browser data warnings:

```json
"resolutions": {
    "caniuse-lite": "^<latest-version>"
}
```

Get the latest version with `npm view caniuse-lite version`, then run `yarn install --force` to apply.

---

### Step 6 — update `.gitignore`

Add these entries if not already present:

```gitignore
# Local SSL certificates generated by mkcert for BrowserSync HTTPS
*.pem

# yalc — local package linking for development
.yalc/
yalc.lock
```

---

### Step 7 — fonts: drop WOFF1

Check if `.woff` files exist:

```bash
find src/ -name "*.woff"
```

If found, verify a `.woff2` counterpart exists for each before deleting. Then:

```bash
find src/ -name "*.woff" -delete
```

Remove `.woff` `@font-face` `src:` entries from `src/web/css/fonts.css` (or wherever your `@font-face` declarations live) — keep only the `.woff2` entries.

Also check `src/Magento_Theme/layout/default.xml` for a font preload block and remove any `<item>` entries whose path ends in `.woff`.

---

### Step 8 — SVGs: remove CDATA wrappers

svgo v3 crashes on `/* <![CDATA[ */` wrappers in SVG `<style>` blocks. Check:

```bash
grep -rl 'CDATA' src/
```

For each match, remove the wrapper lines:

```xml
<!-- Before -->
<style>/* <![CDATA[ */ .cls { fill: #000; } /* ]]> */</style>

<!-- After -->
<style>.cls { fill: #000; }</style>
```

---

### Step 9 — custom `webpack.config.js` (if present)

Only if the theme has a `webpack.config.js` in its root:

- **Remove `cache-loader`** entries — webpack v5 has built-in persistent cache
- **Update `postcss-loader`** options — wrap plugin config in `postcssOptions`:
  ```js
  // Before (v3)
  { loader: 'postcss-loader', options: { plugins: [require('autoprefixer')()] } }
  // After (v8)
  { loader: 'postcss-loader', options: { postcssOptions: { plugins: ['autoprefixer'] } } }
  ```
- **Update `webpack-merge` import** — use named export:
  ```js
  // Before
  const merge = require('webpack-merge');
  // After
  const { merge } = require('webpack-merge');
  ```

---

### Step 10 — run Prettier

After all file changes are in place, run Prettier to reformat SCSS, JS, and TS files to match the new config. This is formatting-only — no logic changes:

```bash
npx prettier --write "src/**/*.scss"
npx prettier --write "src/**/*.ts" "src/**/*.js"
```

If any file is missed by the glob, run Prettier directly on the reported path.

---

### Step 11 — verify

```bash
yarn build          # must exit with zero errors (asset size warnings are expected)
yarn build:verbose  # must show no Sass deprecation warnings
yarn lint:css       # must pass with zero errors
yarn lint:js        # must pass with zero errors and zero warnings
```

If `lint:css` or `lint:js` reports errors other than `prettier/prettier`, do not suppress them silently — report them and decide whether they need a fix or a deliberate builder config change.

---

## After migration

Before pushing your branch, check `package.json` for a yalc path:

```json
"@creativestyle/magesuite-frontend-builder": "file:.yalc/..."
```

If present, you are running a local build — this path does not exist in any other environment and will break CI. Replace it with a semver range once the builder is publicly released:

```json
"@creativestyle/magesuite-frontend-builder": "^5.0.0"
```

Also update `composer.json` in the migrated theme to point `creativestyle/theme-creativeshop` at the correct branch.

---

## SCSS migration

The builder migration does **not** touch SCSS. Themes may continue using `@import` indefinitely — the builder silences the relevant Dart Sass deprecations. When you are ready to migrate SCSS to `@use`/`@forward`, run the separate skill:

```
/mgs-migrate-sass
```
