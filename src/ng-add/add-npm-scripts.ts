import { workspaces } from "@angular-devkit/core";
import { Rule, SchematicsException, Tree } from "@angular-devkit/schematics";
import { NgAddOptions } from "./interfaces";

export function addNPMScripts(options: NgAddOptions): Rule {
    return (tree: Tree) => {
        const pkgPath = '/package.json';
        const buffer = tree.read(pkgPath);

        if (buffer === null) {
            throw new SchematicsException('Could not find package.json');
        }
        addScripts(tree, pkgPath, JSON.parse(buffer.toString()), options);
    };
}

function addScripts(tree: Tree, pkgPath: string, pkg: any, options: NgAddOptions): void {
    if (options.project) {
        addScriptsForTheSpecificProject(pkg, options.project);
    } else {
        addDefaultScripts(pkg);
    }

    tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
}

function addScriptsForTheSpecificProject(pkg: any, project: string): void {
    pkg.scripts[`electron:${project}`] = `ng build ${project} --base-href ./ && electron . --trace-warnings`;
    pkg.scripts['spackage'] = `electron-packager . --out=my-toolkit --ignore=/src --ignore=/node_modules --overwrite`;
}

function addDefaultScripts(pkg: any): void {
    pkg.scripts['electron'] = `ng build --base-href ./ && electron . --trace-warnings`;
    pkg.scripts['spackage'] = `electron-packager . --out=my-toolkit --ignore=/src --ignore=/node_modules --overwrite`;
}
