import { DzueluTypeScriptProject } from './src/dzueluTypeScriptProject';

const project = new DzueluTypeScriptProject({
  description: 'A simple standard way to setup a repo for typescript in a style Dzuelu likes.',
  name: 'dzuelu-projen',
  releaseToNpm: true
});

project.addDeps('projen');

// Only needed here, recompile lint rules before running linter
project.tasks.tryFind('eslint')?.prependExec('npx projen compile');

project.synth();
