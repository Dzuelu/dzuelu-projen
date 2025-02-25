import { Component, SampleFile } from "projen";
import { NodeProject } from "projen/lib/javascript";

/**
 * This is a hack until projen has the new eslint config support.
 */
export class DzEslint extends Component {
  project: NodeProject;
  eslintFile: SampleFile;

  constructor(scope: NodeProject, id?: string) {
    super(scope, id ?? 'dzuelu-eslint');
    this.project = scope;
    this.eslintFile = new SampleFile(scope, 'eslint.config.mjs', {
      contents: [
        "import defaultLint from './src/components/dzEslintConfig';",
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
      'eslint-plugin-import',
      'eslint-plugin-jest',
      'eslint-plugin-n',
      'eslint-plugin-prettier',
      'prettier',
      'typescript-eslint',
    );
    this.project.addScripts({
      'eslint': 'eslint .'
    });
  }

  // synthesize(): void {
    
  // }
}
