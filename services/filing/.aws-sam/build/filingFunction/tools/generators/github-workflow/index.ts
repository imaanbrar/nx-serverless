import * as fs from 'fs';
import * as toml from 'toml';
import { exec } from 'child_process';
import { generateFiles, joinPathFragments, names, Tree } from '@nrwl/devkit';
import { GithubWorkflowSchema } from './schema';

interface Schema {
  name: string;
  project: string;
}

export default async function (tree: Tree, schema: GithubWorkflowSchema) {
  const serviceRoot = `services/${schema.name}`;

    // run  sam pipeline bootstrap command
    // this command sets up the following AWS infrastructure resources:
    // a pipeline IAM user with access key ID and secret key access credentials to be shared with the CI/CD system.
    // a pipeline execution IAM role assumed by the pipeline user to obtain access to the AWS account.
    // an AWS CloudFormation execution IAM role assumed by AWS CloudFormation to deploy the AWS SAM application.
    // an Amazon S3 bucket to hold the AWS SAM artifacts.
    await new Promise((resolve, reject) => {
        exec('sam pipeline bootstrap --no-interactive --stage dev --profile pcff-dev --no-confirm-changeset --region ca-central-1', {
            cwd: process.cwd() + '/' + serviceRoot
            }, (err, stdout, stderr) => {
             if (err) {
               console.log(err);
               reject(err);
             } else {
              console.log(stdout);
               resolve(stdout); 
             }
           });
     });
     await new Promise((resolve, reject) => {
         exec('sam pipeline bootstrap --no-interactive --stage uat --profile pcff-uat --no-confirm-changeset --region ca-central-1', {
             cwd: process.cwd() + '/' + serviceRoot
             }, (err, stdout, stderr) => {
              if (err) {
                reject(err);
              } else {
                resolve(stdout); 
              }
            });
      });
      await new Promise((resolve, reject) => {
          exec('sam pipeline bootstrap --no-interactive --stage prod --profile pcff-prod --no-confirm-changeset --region ca-central-1', {
              cwd: process.cwd() + '/' + serviceRoot
              }, (err, stdout, stderr) => {
               if (err) {
                 reject(err);
               } else {
                 resolve(stdout); 
               } 
             });
       });

  // add a task to tasks.json
  // let tasksJson = fs.readFileSync(".vscode/tasks.json","utf-8");
  // let tasks: any[] = JSON.parse(tasksJson).tasks;
  // const task = {
  //     "label": `build service/${name}  `,
  //     "type": "shell",
  //     "command": "tsc",
  //     "args": [
  //         "-p",
  //         "${workspaceRoot}/services/" + name
  //     ]
  // }

  // tasks.push(task);
  // tasksJson = JSON.stringify(tasks);
  // fs.writeFileSync(".vscode/tasks.json", tasksJson, "utf-8");
  
  // get pipeline toml file contents as string
  const content = fs.readFileSync(`${serviceRoot}/.aws-sam/pipeline/pipelineconfig.toml`).toString();

  const json = toml.parse(content);
  const dev_pipeline_execution_role = json.dev.pipeline_bootstrap.parameters.pipeline_execution_role;
  const dev_cloudformation_execution_role = json.dev.pipeline_bootstrap.parameters.cloudformation_execution_role;
  const dev_artifacts_bucket = json.dev.pipeline_bootstrap.parameters.artifacts_bucket;

  const uat_pipeline_execution_role = json.uat.pipeline_bootstrap.parameters.pipeline_execution_role;
  const uat_cloudformation_execution_role = json.uat.pipeline_bootstrap.parameters.cloudformation_execution_role;
  const uat_artifacts_bucket = json.uat.pipeline_bootstrap.parameters.artifacts_bucket;

  const prod_pipeline_execution_role = json.prod.pipeline_bootstrap.parameters.pipeline_execution_role;
  const prod_cloudformation_execution_role = json.prod.pipeline_bootstrap.parameters.cloudformation_execution_role;
  const prod_artifacts_bucket = json.prod.pipeline_bootstrap.parameters.artifacts_bucket;

  const { name } = names(schema.name);
  const cicdSchema: GithubWorkflowSchema = {
      name,
      dev_pipeline_execution_role,
      dev_cloudformation_execution_role,
      dev_artifacts_bucket,
      uat_pipeline_execution_role,
      uat_cloudformation_execution_role,
      uat_artifacts_bucket,
      prod_pipeline_execution_role,
      prod_cloudformation_execution_role,
      prod_artifacts_bucket
  }

  console.log(cicdSchema);

  generateFiles(tree, joinPathFragments(__dirname, './files'), '.github/workflows', {
      ...cicdSchema,
      tmpl: '',
      fileName: name,
  });
}