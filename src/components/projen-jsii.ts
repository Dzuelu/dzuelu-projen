import { Component, Task } from 'projen';
import { NodeProject } from 'projen/lib/javascript';
import { JsiiPacmakTarget } from 'projen/lib/cdk/consts';

export class ProjenJsii extends Component {
  private readonly packageAllTask: Task;
  private readonly packageJsTask: Task;

  constructor(project: NodeProject, id?: string) {
    super(project, id ?? 'jsii');

    project.addDevDeps('jsii', 'jsii-pacmak');

    this.packageAllTask = project.tasks.addTask('package-all', {
      description: 'Packages artifacts for all target languages'
    });
    this.packageJsTask = this.addPackagingTask('js');

    project.packageTask.reset();
    project.packageTask.spawn(this.packageJsTask, {
      // Only run in CI
      condition: `node -e "if (!process.env.CI) process.exit(1)"`
    });
    project.packageTask.spawn(this.packageAllTask, {
      // Don't run in CI
      condition: `node -e "if (process.env.CI) process.exit(1)"`
    });
  }

  private addPackagingTask(language: JsiiPacmakTarget): Task {
    const packageTargetTask = this.project.tasks.addTask(`package:${language}`, {
      description: `Create ${language} language bindings`
    });
    const commandParts = ['jsii-pacmak', '-v'];

    commandParts.push(`--target ${language}`);

    packageTargetTask.exec(commandParts.join(' '));

    this.packageAllTask.spawn(packageTargetTask);
    return packageTargetTask;
  }
}
