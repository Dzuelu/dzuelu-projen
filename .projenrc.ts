import { DzueluTypeScriptProject } from './src/dzueluTypeScriptProject';

const project = new DzueluTypeScriptProject({
  name: 'dzuelu-projen',
  description: 'A simple standard way to setup a repo for typescript in a style Dzuelu likes.'
});

project.addDeps('projen');

project.synth();
