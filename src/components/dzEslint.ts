import { Component, SampleFile } from 'projen';
import { NodeProject } from 'projen/lib/javascript';

/**
 * This is a hack until projen has the new eslint config support.
 */
export class DzEslint extends Component {
  eslintFile: SampleFile;
  project: NodeProject;

  constructor(scope: NodeProject, id?: string) {
    super(scope, id ?? 'dzuelu-eslint');
    this.project = scope;
    this.eslintFile = new SampleFile(scope, 'eslint.config.mjs', {
      contents: [
        // Print out manual default linter so we can change rules as wanted for any repo
        "import { defaultLint } from 'dzuelu-projen';",
        '',
        'export default defaultLint;',
        ''
      ].join('\n')
    });
  }

  preSynthesize(): void {
    this.project.addDevDeps(
      '@eslint/eslintrc',
      '@eslint/js',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint',
      'eslint-config-prettier',
      'eslint-import-resolver-typescript',
      'eslint-plugin-perfectionist',
      'eslint-plugin-import',
      'eslint-plugin-jest',
      'eslint-plugin-n',
      'eslint-plugin-prettier',
      'prettier',
      'typescript-eslint'
    );
    this.project.addScripts({
      eslint: 'eslint .'
    });
  }
}
