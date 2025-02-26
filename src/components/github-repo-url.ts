import { execSync } from 'child_process';
import { Component } from 'projen';
import { NodeProject } from 'projen/lib/javascript';

export class GithubRepoUrl extends Component {
  public readonly allowedRemotes = ['remote.origin.url'];
  public readonly nodeProject: NodeProject;

  get url() {
    return this.repoUrl;
  }

  private repoUrl: string | undefined;

  constructor(project: NodeProject, id?: string) {
    super(project, id ?? 'github-repo-url');
    this.nodeProject = project;
  }

  static httpUrl(url: string): string {
    if (url.startsWith('git@')) {
      return url.replace(':', '/').replace('git@', 'https://').replace('.git', '');
    }
    return url;
  }

  static sshUrl(url: string): string {
    if (url.startsWith('https://')) {
      return `${url.replace('.com/', '.com:').replace('https://', 'git@')}${url.endsWith('.git') ? '' : '.git'}`;
    }
    return url;
  }

  public override preSynthesize(): void {
    super.preSynthesize();
    this.setUrl();

    if (this.url != null) {
      // eslint-disable-next-line
      if (this.nodeProject.manifest?.homepage == null) {
        this.nodeProject.package.addField('homepage', GithubRepoUrl.httpUrl(this.url));
      }
      // eslint-disable-next-line
      if (this.nodeProject.manifest?.repository == null) {
        this.nodeProject.package.addField('repository', {
          type: 'git',
          url: GithubRepoUrl.sshUrl(this.url)
        });
      }
    }
  }

  public setUrl() {
    if (this.url != null) {
      return; // already set
    }

    let remotes: string[];
    try {
      remotes = execSync('git config -l')
        .toString()
        .split('\n')
        .filter(r => this.allowedRemotes.some(allowed => r.startsWith(allowed)))
        .map(r => r.trim());
    } catch {
      throw new Error('Error getting git config');
    }
    if (remotes.length === 0) {
      throw new Error('No valid git remotes found!');
    }
    this.repoUrl = this.allowedRemotes.reduce((foundRemote: string | undefined, allowedRemote) => {
      if (foundRemote != null) {
        return foundRemote;
      }
      const found = remotes.find(remote => remote.startsWith(allowedRemote));
      return found?.split('=')[1];
    }, undefined);
  }
}
