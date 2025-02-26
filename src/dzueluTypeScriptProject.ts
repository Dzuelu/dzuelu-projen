/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TypeScriptProject, TypeScriptProjectOptions } from 'projen/lib/typescript';

import { GithubRepoUrl } from './components/github-repo-url';
import { DzEslint } from './components/linter/dzEslint';

export interface DzueluTypeScriptProjectOptions extends TypeScriptProjectOptions {
  readonly dzEslint?: boolean;
}

export const dzCommonOptionDefaults: DzueluTypeScriptProjectOptions = {
  defaultReleaseBranch: 'main', // Overridden by incoming param
  disableTsconfigDev: true,
  eslint: false,
  githubOptions: {
    mergify: false,
    pullRequestLint: false
  },
  name: '', // Overridden by incoming param
  npmignoreEnabled: false,
  prettier: false,
  projenrcTs: true,
  pullRequestTemplate: false,
  tsconfig: {
    compilerOptions: {
      baseUrl: 'src',
      lib: ['ES2023'],
      noEmitOnError: true,
      noFallthroughCasesInSwitch: undefined,
      noUnusedLocals: undefined,
      outDir: 'dist',
      rootDir: undefined,
      skipLibCheck: true,
      target: 'ES2023',
      tsBuildInfoFile: undefined
    },
    exclude: ['.projenrc.ts'],
    include: ['*.ts', '*/**.ts']
  }
} as DzueluTypeScriptProjectOptions;

export class DzueluTypeScriptProject extends TypeScriptProject {
  dzEslint?: DzEslint;
  githubRepoUrl?: GithubRepoUrl;

  constructor(options: DzueluTypeScriptProjectOptions) {
    super({
      // @ts-ignore
      defaultReleaseBranch: '',
      ...dzCommonOptionDefaults,
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
      this.dzEslint = new DzEslint(this);
    }

    this.githubRepoUrl = new GithubRepoUrl(this);
  }
}
