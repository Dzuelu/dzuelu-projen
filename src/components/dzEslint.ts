import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";

/**
 * This is a hack until projen has the new eslint config support.
 */
export class DzEslint extends Component {
  project: NodeProject;

  constructor(scope: NodeProject, id?: string) {
    super(scope, id ?? 'dzuelu-eslint');
    this.project = scope;
  }

  preSynthesize(): void {
    this.project.addDevDeps('@eslint/eslintrc');
  }
}
