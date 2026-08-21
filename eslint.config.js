import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import query from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  globalIgnores(['dist', 'coverage', 'eslint.config.js']),

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    plugins: { 'jsx-a11y': jsxA11y },
    // @ts-expect-error — jsx-a11y flatConfigs typings are incomplete
    rules: jsxA11y.flatConfigs.recommended.rules,
  },

  // @ts-expect-error — @tanstack/eslint-plugin-query flat config typings are incomplete
  ...query.configs['flat/recommended'],

  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: { allowDefaultProject: ['eslint.config.js', 'vitest.config.ts'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // La librería HTTP existe en UN solo directorio. Si aparece en otro, el
  // transporte dejó de ser sustituible.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/infrastructure/http/**'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [{ name: 'axios', message: 'Solo src/infrastructure/http puede importar axios.' }],
      }],
    },
  },

  // ── LA REGLA DE DEPENDENCIA ───────────────────────────────────────────
  // El dominio es TypeScript puro: no conoce React, ni la librería HTTP, ni
  // la caché, ni las capas de fuera. Eso es lo que lo vuelve testeable sin
  // un solo doble de prueba.
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [{ name: 'axios', message: 'Solo src/infrastructure/http puede importar axios.' }],
        patterns: [
          { group: ['react', 'react-*', 'axios', '@tanstack/*', 'react-hook-form'],
            message: 'El dominio no depende de frameworks.' },
          { group: ['@/presentation/*', '@/infrastructure/*', '@/application/*'],
            message: 'Las dependencias apuntan hacia dentro.' },
        ],
      }],
    },
  },
  {
    files: ['src/application/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [{ name: 'axios', message: 'Solo src/infrastructure/http puede importar axios.' }],
        patterns: [
          { group: ['@/presentation/*', '@/infrastructure/*'],
            message: 'La aplicación define interfaces; la infraestructura las implementa, no al revés.' },
          { group: ['axios', 'react', 'react-*'],
            message: 'La aplicación no sabe cómo viajan los datos.' },
        ],
      }],
    },
  },

  { files: ['**/*.spec.{ts,tsx}'], rules: { '@typescript-eslint/no-non-null-assertion': 'off' } },
  prettier,   // último siempre: apaga lo que Prettier decide
);
