module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'complexity': ['warn', 10],
    'no-duplicate-imports': 'warn',
    'no-unreachable-loop': 'warn',
    'camelcase': ['warn', { ignoreDestructuring: true, ignoreImports: true }],
    'curly': ['error', 'multi-line', 'consistent'],
    'eqeqeq': ['error', 'smart'],
    'no-alert': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-case-declarations': 'error',
    'no-delete-var': 'error',
    'no-empty': 'warn',
    'no-extra-label': 'warn',
    'no-lonely-if': 'warn',
    'no-return-await': 'warn',
    'no-useless-rename': 'warn',
    'no-useless-return': 'warn',
    'object-shorthand': 'warn',
    'operator-assignment': 'warn',
    'prefer-arrow-callback': 'warn',
    'prefer-exponentiation-operator': 'warn',
    'yoda': ['warn', 'never', { exceptRange: true }],
    'prefer-object-spread': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'no-sequences': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-implied-eval': 'error',
    'no-octal-escape': 'error',
    'no-throw-literal': 'error',
    'require-unicode-regexp': 'error',

    '@typescript-eslint/consistent-type-imports': ['warn', { fixStyle: 'inline-type-imports' }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
    ],
  },
}
