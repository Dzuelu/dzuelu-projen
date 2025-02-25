import { config, ConfigWithExtends } from 'typescript-eslint';

import eslintPluginNode from 'eslint-plugin-n';
import eslintPluginPrettier  from 'eslint-plugin-prettier';
import { ArrowParens, PrettierSettings, TrailingComma } from 'projen/lib/javascript';

export const ignores: ConfigWithExtends = {
  ignores: [
    'node_modules',
    'dist',
    'docs'
  ]
};

const jsExtensions = ['.mjs', '.js'];
export const js: ConfigWithExtends = {
  files: [`**/*{${jsExtensions.join(',')}}`, `*${jsExtensions.join(',')}`]
};

const tsExtensions = ['.ts', '.d.ts'];
export const ts: ConfigWithExtends = {
  files: [`**/*{${tsExtensions.join(',')}}`, `*${tsExtensions.join(',')}`],
  plugins: {
    n: eslintPluginNode
  }
};

export const prettier: ConfigWithExtends = {
  files: [`**/*{${jsExtensions.concat(jsExtensions).join(',')}}`, `*${jsExtensions.concat(jsExtensions).join(',')}`],
  plugins: {
    prettier: eslintPluginPrettier
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        arrowParens: ArrowParens.AVOID,
        printWidth: 140,
        singleQuote: true,
        trailingComma: TrailingComma.NONE,
        useTabs: false
      } as PrettierSettings
    ]
  }
};

export const jest: ConfigWithExtends = {};

export const tsDeclaration: ConfigWithExtends = {
  files: ['*.d.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
};

export const defaultLint = config(ignores, js, ts, prettier, jest, tsDeclaration);
