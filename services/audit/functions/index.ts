import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  DynamoDBStreamEvent,
} from 'aws-lambda';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (
  event: DynamoDBStreamEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  const records = event.Records;

  records.forEach(record => {
    // process record
    console.log(record);
});

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'audit save complete',
    }),
  };
};
