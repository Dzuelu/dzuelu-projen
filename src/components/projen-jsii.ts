import { Component, Task } from 'projen';
import { NodeProject } from 'projen/lib/javascript';
import { JsiiPacmakTarget } from 'projen/lib/cdk/consts';
import { Stability } from 'projen/lib/cdk';

const REPO_TEMP_DIRECTORY = 'package';

export interface ProjenJsiiOptions {
  readonly author: string;
}

export class ProjenJsii extends Component {
  private readonly packageAllTask: Task;
  private readonly packageJsTask: Task;

  constructor(project: NodeProject, options: ProjenJsiiOptions) {
    super(project, 'jsii');

    project.addFields({
      author: options.author,
      jsii: {
        outdir: project.artifactsDirectory,
        targets: {},
        tsc: {
          outDir: 'dist',
          rootDir: 'src'
        },
        tsconfig: 'tsconfig.json',
        validateTsconfig: 'minimal'
      },
      stability: Stability.EXPERIMENTAL,
      summary: ''
    });
    project.addDevDeps('jsii', 'jsii-pacmak', 'jsii-rosetta');
    project.gitignore.addPatterns('.jsii', REPO_TEMP_DIRECTORY);

    if (project.npmignore == null) {
      throw new Error('npmignore required for jsii');
    }
    // jsii updates .npmignore, so we make it writable
    project.npmignore.readonly = false;
    project.npmignore.include('.jsii');

    this.packageAllTask = project.tasks.addTask('package-all', {
      description: 'Packages artifacts for all target languages'
    });
    this.packageJsTask = this.addPackagingTask('js');

    const jsiiFlags = ['--silence-warnings=reserved-word', '--no-fix-peer-dependencies'];

    project.compileTask.reset(['jsii', ...jsiiFlags].join(' '));

    project.packageTask.reset();
    project.packageTask.spawn(this.packageJsTask, {
      // Only run in CI
      condition: `node -e "if (!process.env.CI) process.exit(1)"`
    });
    project.packageTask.spawn(this.packageAllTask, {
      // Don't run in CI
      condition: `node -e "if (process.env.CI) process.exit(1)"`
    });

    // Appends these commands to add the .jsii file into the bundle
    project.packageTask.exec(`mkdir -p ${REPO_TEMP_DIRECTORY}`);
    project.packageTask.exec(`tar --strip-components=1 -xzvf ${project.artifactsDirectory}/js/*.tgz -C ${REPO_TEMP_DIRECTORY}`);
    project.packageTask.exec(`cp .jsii ${REPO_TEMP_DIRECTORY}/.jsii`);
    project.packageTask.exec(`tar -czvf dist/js/${project.name}@0.0.0.jsii.tgz ${REPO_TEMP_DIRECTORY}`);
    project.packageTask.exec(`rm -r ${REPO_TEMP_DIRECTORY}`);
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
