import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'Scripts/lib/**']
  },
  {
    files: ['Scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        admob: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }]
    }
  },
  {
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node }
    }
  }
];