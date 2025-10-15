import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_'
            }],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
            'no-console': ['error', {allow: ['warn', 'error']}],
            'no-unreachable': 'error',
            'no-unused-vars': 'off'
        }
    },
    {
        ignores: [
            '.next/',
            'node_modules/',
            'dist/',
            'build/',
            'coverage/',
            '*.config.js',
            '*.config.ts',
            '*.config.mjs',
            '.husky/',
            'public/',
            ''
        ]
    }
);
