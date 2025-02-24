import { TypeScriptProject, TypeScriptProjectOptions } from "projen/lib/typescript";
import { DzEslint } from "./components/dzEslint";

export interface DzueluTypeScriptProjectOptions extends Partial<TypeScriptProjectOptions> {
  name: string;
  dzEslint?: boolean;
}

export class DzueluTypeScriptProject extends TypeScriptProject {
  dzEslint?: DzEslint;

  constructor(options: DzueluTypeScriptProjectOptions) {
    super({
      defaultReleaseBranch: 'main',
      projenrcTs: true,
      disableTsconfigDev: true,
      eslint: false,
      prettier: false,
      ...options
    });

    this.package.removeScript('clobber');
    this.package.removeScript('default');
    this.package.removeScript('eject');

    if (options.dzEslint === true) {
      this.dzEslint = new DzEslint(this);
    }
  }
}
