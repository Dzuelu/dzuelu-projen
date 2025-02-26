/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import eslint from '@eslint/js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as eslintPluginImport from 'eslint-plugin-import';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginNode from 'eslint-plugin-n';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { ArrowParens, PrettierSettings, TrailingComma } from 'projen/lib/javascript';
import { config, configs, ConfigWithExtends, parser } from 'typescript-eslint';

export const ignores: ConfigWithExtends = {
  ignores: ['node_modules', 'dist', 'docs']
};

const jsExtensions = ['.mjs', '.js'];
export const js: ConfigWithExtends = {
  extends: [configs.disableTypeChecked],
  files: [`**/*{${jsExtensions.join(',')}}`, `*${jsExtensions.join(',')}`]
};

const tsExtensions = ['.ts', '.d.ts'];
export const ts: ConfigWithExtends = {
  extends: [
    eslintPluginImport.flatConfigs.errors,
    eslintPluginImport.flatConfigs.warnings,
    configs.strictTypeChecked,
    configs.stylisticTypeChecked,
    eslint.configs.recommended,
    // eslint-disable-next-line import/namespace
    eslintPluginPerfectionist.configs['recommended-natural']
  ],
  files: [`**/*{${tsExtensions.join(',')}}`, `*${tsExtensions.join(',')}`],
  languageOptions: {
    globals: {
      ...eslintPluginNode.configs['flat/recommended'].languageOptions?.globals
    },
    parser,
    parserOptions: {
      projectService: { allowDefaultProject: ['.projenrc.ts'] }
    }
  },
  plugins: {
    n: eslintPluginNode
  },
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      { format: null, modifiers: ['requiresQuotes'], selector: 'default' },
      { format: ['camelCase', 'PascalCase', 'UPPER_CASE'], selector: 'default' }
    ],
    '@typescript-eslint/require-await': 'error',
    camelcase: 'off',
    'import/extensions': ['error', 'never', { ignorePackages: true }],
    'import/no-duplicates': 'error',
    'no-throw-literal': 'error',
    'perfectionist/sort-imports': ['error', { newlinesBetween: 'never', type: 'unsorted' }]
  },
  settings: {
    'import/extensions': tsExtensions.concat(jsExtensions),
    'import/parsers': { '@typescript-eslint/parser': tsExtensions },
    'import/resolver': {
      node: {
        moduleDirectory: ['./src', './node_modules']
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    },
    node: {
      extensions: tsExtensions.concat(jsExtensions),
      resolvePaths: ['./src', './node_modules']
    }
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
  languageOptions: {
    globals: {
      ...eslintPluginNode.configs['flat/recommended'].languageOptions?.globals,
      ...eslintPluginJest.environments.globals.globals
    }
  },
  plugins: { jest: eslintPluginJest },
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
