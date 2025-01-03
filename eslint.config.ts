import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

const config: any = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json'
    },
    globals: {
        ...globals.browser
    },
    plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react-refresh/recommended'
    ],
    rules: {
        // Add or modify rules as needed
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    }
}

export default config
