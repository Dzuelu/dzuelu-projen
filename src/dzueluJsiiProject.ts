import { JsiiProject, JsiiProjectOptions } from 'projen/lib/cdk';

import { GithubRepoUrl } from './components/github-repo-url';
import { DzEslint } from './components/linter/dzEslint';
import { dzCommonOptionDefaults } from './dzueluTypeScriptProject';

export interface DzueluJsiiOptions extends JsiiProjectOptions {
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

  constructor(options: DzueluJsiiOptions) {
    super({
      ...dzCommonOptionDefaults,
      disableTsconfigDev: false, // jsii forced option...
      npmignoreEnabled: true,
      tsconfig: {
        ...dzCommonOptionDefaults.tsconfig,
        compilerOptions: {
          // jsii enforced....
          ...dzCommonOptionDefaults.tsconfig?.compilerOptions,
          lib: ['ES2022'],
          stripInternal: false,
          target: 'ES2022'
        }
      },
      tsconfigDevFile: 'tsconfig.json',
      // tsconfigDevFile: 'tsconfig.json',
      ...options
    });

    // scripts I don't want or use
    this.package.removeScript('clobber');
    this.package.removeScript('default');
    this.package.removeScript('eject');

    // force include our now custom tsconfig
    this.gitignore.removePatterns('tsconfig.json');

    this.package.addField('files', ['dist/src']);
    this.package.addField('main', 'dist/src/index.js');
    this.package.addField('types', 'dist/src/index.d.ts');

    // Jsii hacks
    const jsiiFlags = ['--silence-warnings=reserved-word', '--no-fix-peer-dependencies'];
    this.compileTask.reset(['jsii', ...jsiiFlags].join(' '));
    this.watchTask.reset(['jsii', '-w', ...jsiiFlags].join(' '));
    this.package.addField('jsii', {
      // eslint-disable-next-line
      ...this.package.manifest?.jsii,
      tsconfig: 'tsconfig.json'
    });

    this.dzEslint = new DzEslint(this);
    this.githubRepoUrl = new GithubRepoUrl(this);
  }
}
