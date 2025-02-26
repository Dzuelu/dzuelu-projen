import { ProjenJsii } from './src/components/projen-jsii';
import { DzueluTypeScriptProject } from './src/dzueluTypeScriptProject';

const project = new DzueluTypeScriptProject({
  description: 'A simple standard way to setup a repo for typescript in a style Dzuelu likes.',
  name: 'dzuelu-projen',
  releaseToNpm: true
});

project.addDeps('projen', 'constructs');

project.AddComponent(new ProjenJsii(project));

project.synth();
