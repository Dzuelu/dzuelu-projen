import { JsiiProject, JsiiProjectOptions } from 'projen/lib/cdk';

import { GithubRepoUrl } from './components/github-repo-url';
import { DzEslint } from './components/linter/dzEslint';
import { dzCommonOptionDefaults } from './dzueluTypeScriptProject';

export interface DzueluTypeScriptProjectOptions extends Partial<JsiiProjectOptions> {
  author: string;
  authorAddress: string;
  dzEslint?: boolean;
  name: string;
}

/**
 * Not exported but used just for this project to override default projen behavior.
 * Allows `npx projen new --from dzuelu-projen` command
 */
export class DzueluJsiiProject extends JsiiProject {
  dzEslint?: DzEslint;
  githubRepoUrl?: GithubRepoUrl;

  constructor(options: DzueluTypeScriptProjectOptions) {
    super({
      defaultReleaseBranch: '',
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
