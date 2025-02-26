import { DzueluJsiiProject } from './src/dzueluJsiiProject';

const project = new DzueluJsiiProject({
  author: 'Dzuelu',
  authorAddress: 'projen@dzuelu.com',
  description: 'A simple standard way to setup a repo for typescript in a style Dzuelu likes.',
  name: 'dzuelu-projen',
  releaseToNpm: true
});

// project.addDeps('projen', 'constructs');

// remove self, only for sub-projects
// project.deps.removeDependency('');

project.synth();
