import js from '@eslint/js';
import globals from 'globals';

import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-plugin-prettier';
import eslintCustomRules from './src/shared/config/eslint/rule.mjs';

export default tseslint.config(
  { ignores: ['dist', 'build', 'out', '.lintstagedrc.cjs', '.next', 'node_modules'] },
  jsxA11y.flatConfigs.recommended,
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{js,jsx,ts,tsx,mts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    plugins: {
      prettier,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      ...eslintCustomRules,
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      // control-has-associated-label: recommended에서 off → warn으로 활성화
      'jsx-a11y/control-has-associated-label': 'warn',
      // label-has-associated-control: recommended에서 error → 기존 코드베이스 호환을 위해 warn으로 완화
      'jsx-a11y/label-has-associated-control': 'warn',
    },

    settings: {
      react: {
        version: 'detect',
      },
      'jsx-a11y': {
        components: {
          Button: 'button',
          Input: 'input',
          Label: 'label',
          Textarea: 'textarea',
          Select: 'select',
          Checkbox: 'input',
        },
      },
    },
  },
);
