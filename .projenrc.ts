import { JsiiProject } from 'projen/lib/cdk';

const project = new JsiiProject({
  author: 'Dzuelu',
  authorAddress: 'projen@dzuelu.com',
  defaultReleaseBranch: 'main',
  description: 'A simple standard way to setup a repo for typescript in a style Dzuelu likes.',
  name: 'dzuelu-projen',
  releaseToNpm: true,
  repositoryUrl: ''
});

// project.addDeps('projen', 'constructs');

// remove self, only for sub-projects
// project.deps.removeDependency('');

project.synth();
