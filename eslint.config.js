import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
    {
        ignores: [
            'src/etc/**/*',
            'src/**/vendors/**/*',
            'src/**/vendor/**/*',
            'src/Magento_*/**/*',
            'src/MageSuite_*/**/*',
            'src/PluginCompany_*/**/*',
            'src/Smile_*/**/*',
            'src/Creativestyle_*/**/*',
            'src/web/**/*',
            'src/requirejs-config.js',
        ],
    },
    {
        files: ['**/*.js'],
        extends: [js.configs.recommended, prettier],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                require: 'readonly',
                module: 'writable',
                exports: 'writable',
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly',
                console: 'readonly',
                window: 'readonly',
                document: 'readonly',
                Buffer: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                URL: 'readonly',
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'error',
            'no-empty': ['error', { allowEmptyCatch: true }],
        },
    },
    {
        files: ['**/*.ts'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            prettier,
        ],
        languageOptions: {
            sourceType: 'module',
            parser: tseslint.parser,
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-naming-convention': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'prefer-arrow-callback': 'off',
            'object-shorthand': 'off',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-shadow': 'off',
        },
    },
    // Disabled for pre-existing JS/TS code patterns in theme files.
    // These violations exist regardless of SCSS migration status — restoring them
    // requires deliberate theme-side fixes, not a sass migration.
    {
        files: ['**/*.{js,ts}'],
        rules: {
            'no-var': 'off',
            'no-useless-assignment': 'off',
            'no-useless-escape': 'off',
            'prefer-rest-params': 'off',
            'no-constant-binary-expression': 'off',
            'valid-typeof': 'off',
        },
    }
);
