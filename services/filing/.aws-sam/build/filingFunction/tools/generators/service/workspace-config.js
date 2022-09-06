"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWorkspaceConfig = void 0;
const devkit_1 = require("@nrwl/devkit");
const buildRunCommandConfig = (dir, command) => ({
    executor: '@nrwl/workspace:run-commands',
    options: {
        cwd: dir,
        color: true,
        command: command,
    },
});
const addWorkspaceConfig = (host, projectName, serviceRoot) => {
    (0, devkit_1.addProjectConfiguration)(host, projectName, {
        root: serviceRoot,
        projectType: 'application',
        sourceRoot: `${serviceRoot}/src`,
        targets: {
            build: {
                ...buildRunCommandConfig(serviceRoot, 'tsc && sam build'),
            },
            serve: {
                ...buildRunCommandConfig(serviceRoot, 'tsc && sam local start-api -d 8065'),
            },
            deploy: {
                ...buildRunCommandConfig(serviceRoot, 'sam deploy'),
                dependsOn: [
                    {
                        target: 'deploy',
                        projects: 'dependencies',
                    },
                ],
            },
            remove: {
                ...buildRunCommandConfig(serviceRoot, 'sam delete'),
            },
            lint: {
                executor: '@nrwl/linter:eslint',
                options: {
                    lintFilePatterns: [`${serviceRoot}/**/*.ts`],
                },
            },
        },
        tags: ['service'],
        implicitDependencies: ['core'],
    });
};
exports.addWorkspaceConfig = addWorkspaceConfig;
//# sourceMappingURL=workspace-config.js.map