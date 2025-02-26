import { Component } from 'projen';
import { NodeProject } from 'projen/lib/javascript';

export class ProjenJsii extends Component {
  constructor(project: NodeProject, id?: string) {
    super(project, id ?? 'jsii');

    project.addDevDeps('jsii', 'jsii-pacmak');
  }
}
