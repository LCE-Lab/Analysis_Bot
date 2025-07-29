import typescriptEslint from 'typescript-eslint'
import globals from 'globals'
import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default [
  pluginJs.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/coverage',
      '**/ecosystem.config.js'
    ]
  },
  {
    plugins: {
      '@stylistic': stylistic
    },

    languageOptions: {
      globals: {
        ...globals.node
      },
      ecmaVersion: 12,
      sourceType: 'module'
    },

    rules: {
      eqeqeq: 'error',
      'no-unused-vars': 'warn',
      camelcase: ['warn', { properties: 'never', ignoreDestructuring: true, ignoreImports: true }],
      'no-var': 'error',
      'no-useless-return': 'error',
      'no-else-return': 'error',
      'no-empty': 'error',
      'no-duplicate-imports': 'error',

      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/space-before-function-paren': ['error', { named: 'never' }],
      '@stylistic/space-in-parens': 'error',
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/comma-dangle': 'error'
    }
  }
]
