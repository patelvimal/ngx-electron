
export interface WorkspaceProject {
    projectType?: string;
    architect?: Record<
        string,
        { builder: string; options?: Record<string, any> }
    >;
    sourceRoot:string;
}

export interface Workspace {
    defaultProject?: string;
    projects: Record<string, WorkspaceProject>;
}

export interface NgAddOptions {
    project:string;
    sourceDir:string;
}