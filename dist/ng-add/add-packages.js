"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = exports.addPackageJsonDependencies = void 0;
const tasks_1 = require("@angular-devkit/schematics/tasks");
const dependencies_1 = require("@schematics/angular/utility/dependencies");
const latest_package_version_1 = require("latest-package-version");
const Observable_1 = require("rxjs/internal/Observable");
const packages = ['electron', 'electron-packager'];
function addPackageJsonDependencies() {
    return (tree, _context) => {
        const observer = new Observable_1.Observable((observer) => {
            latest_package_version_1.getPackageVersions(packages)
                .then((data) => {
                console.log(data.output);
                packages.map((pkg) => {
                    const dependency = {
                        type: dependencies_1.NodeDependencyType.Default,
                        name: pkg,
                        version: `~${data.output[pkg]}`,
                        overwrite: true
                    };
                    dependencies_1.addPackageJsonDependency(tree, dependency);
                    _context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
                });
                observer.next(tree);
                observer.complete();
            })
                .catch(function (err) {
                observer.error(err);
            });
        });
        return observer;
    };
}
exports.addPackageJsonDependencies = addPackageJsonDependencies;
function installDependencies() {
    return (tree, _context) => {
        _context.addTask(new tasks_1.NodePackageInstallTask());
        _context.logger.info('✅️ Dependencies installed');
        return tree;
    };
}
exports.installDependencies = installDependencies;
//# sourceMappingURL=add-packages.js.map