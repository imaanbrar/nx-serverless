import { addProjectConfiguration, Tree } from '@nrwl/devkit';

const buildRunCommandConfig = (dir: string, command: string) => ({
  executor: '@nrwl/workspace:run-commands',
  options: {
    cwd: dir,
    color: true,
    command: command,
  },
});

export const addWorkspaceConfig = (
  host: Tree,
  projectName: string,
  serviceRoot: string
) => {
  addProjectConfiguration(host, projectName, {
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
