import type { Environment } from './environment.types';

export const env: Environment = {
  name: 'dev',
  region: 'ca-central-1',
  profile: 'default',
  jwtSecret: 'secret',
  dynamo: {
    endpoint: 'http://localhost:4566',
    tableName: `dev-AppTable`,
  },
};
