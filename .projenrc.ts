import { ProjenJsii } from './src/components/projen-jsii';
import { DzueluTypeScriptProject } from './src/dzueluTypeScriptProject';

const project = new DzueluTypeScriptProject({
  defaultReleaseBranch: 'main',
  description: 'A simple standard way to setup a repo for typescript in a style Dzuelu likes.',
  name: 'dzuelu-projen',
  npmignoreEnabled: true, // jsii
  releaseToNpm: true
});

project.addDeps('projen', 'constructs');
// project.addPeerDeps('projen', 'constructs');

project.addComponent(
  new ProjenJsii(project, {
    author: 'Dzuelu'
  })
);

// Only needed here, recompile lint rules before running linter
project.tasks.tryFind('eslint')?.prependExec('projen compile');

project.synth();
