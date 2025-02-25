import { TypeScriptProject, TypeScriptProjectOptions } from 'projen/lib/typescript';

import { DzEslint } from './components/dzEslint';

export interface DzueluTypeScriptProjectOptions extends Partial<TypeScriptProjectOptions> {
  dzEslint?: boolean;
  name: string;
}

export class DzueluTypeScriptProject extends TypeScriptProject {
  dzEslint?: DzEslint;

  constructor(options: DzueluTypeScriptProjectOptions) {
    super({
      // buildWorkflowOptions: {
      //   mutableBuild: false
      // },
      defaultReleaseBranch: 'main',
      disableTsconfigDev: true,
      eslint: false,
      npmignoreEnabled: false,
      prettier: false,
      projenrcTs: true,
      pullRequestTemplate: false,
      tsconfig: {
        compilerOptions: {
          baseUrl: 'src',
          lib: ['ES2023'],
          noUnusedLocals: undefined,
          outDir: 'dist',
          rootDir: undefined,
          target: 'ES2023',
          tsBuildInfoFile: undefined
        },
        exclude: ['.projenrc.ts'],
        include: ['*.ts', '*/**.ts']
      },
      ...options
    });

    // scripts I don't want or use
    this.package.removeScript('clobber');
    this.package.removeScript('default');
    this.package.removeScript('eject');

    this.package.addField('files', ['dist/src']);

    if (options.dzEslint ?? true) {
      this.dzEslint = new DzEslint(this);
    }
  }
}
