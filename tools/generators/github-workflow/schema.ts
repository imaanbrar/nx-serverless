export type GithubWorkflowSchema = {
  name: string;
  dev_pipeline_execution_role: string,
  dev_cloudformation_execution_role: string,
  dev_artifacts_bucket: string,
  uat_pipeline_execution_role: string,
  uat_cloudformation_execution_role: string,
  uat_artifacts_bucket: string,
  prod_pipeline_execution_role: string,
  prod_cloudformation_execution_role: string,
  prod_artifacts_bucket: string
};
