import { config, configs, ConfigWithExtends, parser } from 'typescript-eslint';
import { ArrowParens, PrettierSettings, TrailingComma } from 'projen/lib/javascript';
import eslint from '@eslint/js';

import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginNode from 'eslint-plugin-n';
import eslintPluginPrettier from 'eslint-plugin-prettier';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as eslintPluginImport from 'eslint-plugin-import';

export const ignores: ConfigWithExtends = {
  ignores: ['node_modules', 'dist', 'docs']
};

const jsExtensions = ['.mjs', '.js'];
export const js: ConfigWithExtends = {
  files: [`**/*{${jsExtensions.join(',')}}`, `*${jsExtensions.join(',')}`],
  extends: [configs.disableTypeChecked]
};

const tsExtensions = ['.ts', '.d.ts'];
export const ts: ConfigWithExtends = {
  files: [`**/*{${tsExtensions.join(',')}}`, `*${tsExtensions.join(',')}`],
  plugins: {
    n: eslintPluginNode
  },
  extends: [
    eslintPluginImport.flatConfigs.errors,
    eslintPluginImport.flatConfigs.warnings,
    configs.strictTypeChecked,
    configs.stylisticTypeChecked,
    eslint.configs.recommended
  ],
  languageOptions: {
    globals: {
      ...eslintPluginNode.configs['flat/recommended'].languageOptions?.globals
    },
    parser,
    parserOptions: {
      projectService: { allowDefaultProject: ['.projenrc.ts'] }
    }
  },
  settings: {
    'import/extensions': tsExtensions.concat(jsExtensions),
    'import/parsers': { '@typescript-eslint/parser': tsExtensions },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      },
      node: {
        moduleDirectory: ['./src', './node_modules']
      }
    },
    node: {
      extensions: tsExtensions.concat(jsExtensions),
      resolvePaths: ['./src', './node_modules']
    }
  },
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      { format: null, modifiers: ['requiresQuotes'], selector: 'default' },
      { format: ['camelCase', 'PascalCase'], selector: 'default' }
    ],
    '@typescript-eslint/require-await': 'error',
    'import/extensions': ['error', 'never', { ignorePackages: true }],
    'import/no-duplicates': 'error',
    camelcase: 'off'
  }
};

export const prettier: ConfigWithExtends = {
  files: [`**/*{${tsExtensions.concat(jsExtensions).join(',')}}`, `*${tsExtensions.concat(jsExtensions).join(',')}`],
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

export const jest: ConfigWithExtends = {
  ...eslintPluginJest.configs['flat/recommended'],
  ...eslintPluginJest.configs['flat/style'],
  files: ['test/**.ts'],
  plugins: { jest: eslintPluginJest },
  languageOptions: {
    globals: {
      ...eslintPluginNode.configs['flat/recommended'].languageOptions?.globals,
      ...eslintPluginJest.environments.globals.globals
    }
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
};

export const tsDeclaration: ConfigWithExtends = {
  files: ['*.d.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
};

export const defaultLint = config(ignores, js, ts, prettier, jest, tsDeclaration);
