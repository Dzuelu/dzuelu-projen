import { Component } from 'projen';
import { TypeScriptProject, TypeScriptProjectOptions } from 'projen/lib/typescript';
import { GithubRepoUrl } from './components/github-repo-url';
import { DzEslint } from './components/linter/dzEslint';

export interface DzueluTypeScriptProjectOptions extends TypeScriptProjectOptions {
  readonly dzEslint?: boolean;
}

export class DzueluTypeScriptProject extends TypeScriptProject {
  addedComponents: Component[] = [];
  dzEslint?: DzEslint;

  constructor(options: DzueluTypeScriptProjectOptions) {
    super({
      artifactsDirectory: 'dist',
      disableTsconfigDev: true,
      eslint: false,
      githubOptions: {
        mergify: false,
        pullRequestLint: false
      },
      libdir: 'dist',
      npmignoreEnabled: false,
      prettier: false,
      projenrcTs: true,
      pullRequestTemplate: false,
      tsconfig: {
        compilerOptions: {
          baseUrl: 'src',
          lib: ['ES2022'],
          noFallthroughCasesInSwitch: undefined,
          noUnusedLocals: undefined,
          outDir: 'dist',
          rootDir: undefined,
          target: 'ES2022',
          tsBuildInfoFile: undefined
        },
        exclude: ['.projenrc.ts'],
        include: ['*.ts', '*/**.ts']
      },
      ...options
    });

    this.addDevDeps('dzuelu-projen');

    // scripts I don't want or use
    this.package.removeScript('clobber');
    this.package.removeScript('default');
    this.package.removeScript('eject');

    this.package.addField('files', ['dist/src']);
    this.package.addField('main', 'dist/src/index.js');
    this.package.addField('types', 'dist/src/index.d.ts');

    if (options.dzEslint ?? true) {
      this.addComponent(new DzEslint(this));
    }

    this.addComponent(new GithubRepoUrl(this));
  }

  public addComponent(...components: Component[]) {
    this.addedComponents.push(...components);
  }
}
