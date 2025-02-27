import { Component } from 'projen';
import { TypeScriptProject, TypeScriptProjectOptions } from 'projen/lib/typescript';
import { GithubRepoUrl } from './components/github-repo-url';
import { DzEslint } from './components/linter/dzEslint';

export interface DzueluTypeScriptProjectOptions extends Partial<TypeScriptProjectOptions> {
  dzEslint?: boolean;
  name: string;
}

export class DzueluTypeScriptProject extends TypeScriptProject {
  AddedComponents: Component[] = [];
  dzEslint?: DzEslint;

  constructor(options: DzueluTypeScriptProjectOptions) {
    super({
      defaultReleaseBranch: 'main',
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
          lib: ['ES2023'],
          noFallthroughCasesInSwitch: undefined,
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
    this.package.addField('main', 'dist/src/index.js');
    this.package.addField('types', 'dist/src/index.d.ts');

    if (options.dzEslint ?? true) {
      this.AddComponent(new DzEslint(this));
    }

    this.AddComponent(new GithubRepoUrl(this));
  }

  public AddComponent(...components: Component[]) {
    this.AddedComponents.push(...components);
  }
}
