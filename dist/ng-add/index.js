"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const add_packages_1 = require("./add-packages");
function default_1(options) {
    return (tree, _context) => {
        const { path: workspacePath, workspace } = getWorkspace(tree);
        // if  project name is not passed as param then take default project from workspace
        if (!options.project) {
            if (workspace.defaultProject) {
                options.project = workspace.defaultProject;
            }
            else {
                throw new schematics_1.SchematicsException('No Angular project selected and no default project in the workspace');
            }
        }
        // Validating project name
        const project = workspace.projects[options.project];
        if (!project) {
            throw new schematics_1.SchematicsException('The specified Angular project is not defined in this workspace');
        }
        options.sourceDir = buildProjectPath(project);
        // Checking if it is application
        if (project.projectType !== 'application') {
            throw new schematics_1.SchematicsException(`Requires an Angular project type of "application" in angular.json`);
        }
        return schematics_1.chain([
            add_packages_1.addPackageJsonDependencies(),
            //installDependencies(),
            //setupProject(options, project, workspacePath, workspace)
            addTemplateFiles(project)
        ])(tree, _context);
    };
}
exports.default = default_1;
// function setupProject(workspacePath: string, workspace: Workspace): Rule {
//     return (tree: Tree, _context: SchematicContext) => {
//         tree.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
//     }
// }
function addTemplateFiles(project) {
    console.log(project.sourceRoot);
    const sourceTemplates = schematics_1.apply(schematics_1.url('./files'), [
        schematics_1.applyTemplates(Object.assign({}, core_1.strings)), schematics_1.move(project.sourceRoot)
    ]);
    return schematics_1.branchAndMerge(schematics_1.mergeWith(sourceTemplates));
}
function getWorkspace(host) {
    const possibleFiles = ['/angular.json', './angular.json'];
    const path = possibleFiles.find(path => host.exists(path));
    const configBuffer = path ? host.read(path) : undefined;
    if (!path || !configBuffer) {
        throw new schematics_1.SchematicsException(`Could not find angular.json`);
    }
    const content = configBuffer.toString();
    let workspace;
    try {
        workspace = core_1.parseJson(content, core_1.JsonParseMode.Loose);
    }
    catch (e) {
        throw new schematics_1.SchematicsException(`Could not parse angular.json: ${e.message}`);
    }
    return { path, workspace };
}
function buildProjectPath(project) {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    const projectDirName = 'app';
    return `${root}${projectDirName}/`;
}
//# sourceMappingURL=index.js.map