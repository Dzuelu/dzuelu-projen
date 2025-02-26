/* eslint-disable @typescript-eslint/ban-ts-comment */
import { JsiiProject, JsiiProjectOptions } from 'projen/lib/cdk';

import { GithubRepoUrl } from './components/github-repo-url';
import { DzEslint } from './components/linter/dzEslint';
import { dzCommonOptionDefaults } from './dzueluTypeScriptProject';

export interface DzueluJsiiOptions extends Omit<JsiiProjectOptions, 'defaultReleaseBranch' | 'repositoryUrl'> {
  author: string;
  authorAddress: string;
  defaultReleaseBranch?: string;
  dzEslint?: boolean;
  name: string;
  repositoryUrl?: string;
}

/**
 * Not exported but used just for this project to override default projen behavior.
 * Allows `npx projen new --from dzuelu-projen` command
 */
export class DzueluJsiiProject extends JsiiProject {
  dzEslint?: DzEslint;
  githubRepoUrl?: GithubRepoUrl;

  constructor(options: DzueluJsiiOptions) {
    super({
      // @ts-ignore
      defaultReleaseBranch: '',
      // @ts-ignore
      repositoryUrl: '',
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

    this.dzEslint = new DzEslint(this);
    this.githubRepoUrl = new GithubRepoUrl(this);
  }
}
