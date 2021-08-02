import { Rule, SchematicContext } from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { NodeDependency, NodeDependencyType, addPackageJsonDependency } from "@schematics/angular/utility/dependencies";

import { getPackageVersions } from 'latest-package-version';
import { Observable } from "rxjs/internal/Observable";

const packages: string[] = ['electron', 'electron-packager'];

export function addPackageJsonDependencies(): Rule {
    return (tree: Tree, _context: SchematicContext): Observable<Tree> => {
        const observer = new Observable<Tree>((observer) => {
            getPackageVersions(packages)
                .then((data: any) => {
                    console.log(data.output);
                    packages.map((pkg: string) => {
                        const dependency = {
                            type: NodeDependencyType.Default,
                            name: pkg,
                            version: data.output[pkg],
                            overwrite: true
                        }
                        addPackageJsonDependency(tree, dependency);
                        _context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
                    });
                    observer.next(tree);
                    observer.complete();
                })
                .catch(function (err: any) {
                    observer.error(err);
                });
        });
        return observer;
    };
}

export function installDependencies(): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        _context.addTask(new NodePackageInstallTask());
        _context.logger.info('✅️ Dependencies installed');
        return tree;
    };
}