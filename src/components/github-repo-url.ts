import { Component } from 'projen';
import { NodeProject } from 'projen/lib/javascript';

export class GithubRepoUrl extends Component {
  public readonly allowedRemotes = ['remote.origin.url'];
  public readonly project: NodeProject;

  get url() {
    return this.repoUrl;
  }
  private readonly repoUrl: string | undefined;

  constructor(project: NodeProject, id?: string) {
    super(project, id ?? 'github-repo-url');
    this.project = project;
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

  preSynthesize(): void {
    //
  }
}
