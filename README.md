# dzuelu-projen
A projen config that will setup repos easily and how I like them to be.

## How to install
First run the following to get the repo setup correctly.
```
npx projen new typescript
yarn add dzuelu-projen --dev
```
Then modify `.projenrc.ts` to use dzuelu-projen
```typescript
import { DzueluTypeScriptProject } from 'dzuelu-projen';

const project = new DzueluTypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'discord-bot'
});

project.synth();
```
Rerun `npx projen` and you should be all set!
