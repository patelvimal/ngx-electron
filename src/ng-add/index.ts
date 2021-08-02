import { JsonParseMode, parseJson, strings } from '@angular-devkit/core';
import { apply, applyTemplates, branchAndMerge, chain, mergeWith, move, Rule, SchematicContext, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { addPackageJsonDependencies, installDependencies } from './add-packages';
import { NgAddOptions, Workspace, WorkspaceProject } from './interfaces';

export default function (options: NgAddOptions): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const { path: workspacePath, workspace } = getWorkspace(tree);

        // if  project name is not passed as param then take default project from workspace
        if (!options.project) {
            if (workspace.defaultProject) {
                options.project = workspace.defaultProject;

            } else {
                throw new SchematicsException(
                    'No Angular project selected and no default project in the workspace'
                );
            }
        }

        // Validating project name
        const project = workspace.projects[options.project];
        if (!project) {
            throw new SchematicsException(
                'The specified Angular project is not defined in this workspace'
            );
        }

        options.sourceDir = buildProjectPath(project);
        // Checking if it is application
        if (project.projectType !== 'application') {
            throw new SchematicsException(
                `Requires an Angular project type of "application" in angular.json`
            );
        }

        return chain([
            addPackageJsonDependencies(),
            //installDependencies(),
            //setupProject(options, project, workspacePath, workspace)
            addTemplateFiles(project)
        ])(tree, _context);
    };
}


// function setupProject(workspacePath: string, workspace: Workspace): Rule {
//     return (tree: Tree, _context: SchematicContext) => {
//         tree.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
//     }
// }


function addTemplateFiles(project: WorkspaceProject) {
    console.log(project.sourceRoot);
    const sourceTemplates = apply(url('./files'), [
      applyTemplates({
        ...strings,
      }), move(project.sourceRoot)
    ])
    return branchAndMerge(mergeWith(sourceTemplates));
  }

  
function getWorkspace(host: Tree): { path: string; workspace: Workspace } {
    const possibleFiles = ['/angular.json', './angular.json'];
    const path = possibleFiles.find(path => host.exists(path));
    const configBuffer = path ? host.read(path) : undefined;

    if (!path || !configBuffer) {
        throw new SchematicsException(`Could not find angular.json`);
    }

    const content = configBuffer.toString();
    let workspace: Workspace;

    try {
        workspace = (parseJson(content, JsonParseMode.Loose) as {}) as Workspace;
    } catch (e) {
        throw new SchematicsException(`Could not parse angular.json: ${e.message}`);
    }

    return { path, workspace };
}


function buildProjectPath(project: any): string {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    const projectDirName = 'app';
    return `${root}${projectDirName}/`;
}
