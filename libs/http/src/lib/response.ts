import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

const corsHeaders = {
  // Change this to your domains
  'Access-Control-Allow-Origin': '*',
  // Change this to your headers
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': 86400,
}

export function httpResponse(
  data: Record<string, any>,
  { statusCode = 200, ...rest }: Omit<APIGatewayProxyStructuredResultV2, 'body'> = {
    statusCode: 200,
  }
): APIGatewayProxyStructuredResultV2 {
  return {
    body: JSON.stringify({ data }),
    statusCode,
    ...rest,
    headers: {
      ...rest.headers,
      ...corsHeaders
    },
  };
}

export function httpError(
  error: any,
  { statusCode = 400, ...rest }: Omit<APIGatewayProxyStructuredResultV2, 'body'> = {
    statusCode: 200,
  }
): APIGatewayProxyStructuredResultV2 {
  return {
    body: JSON.stringify({ error }),
    statusCode,
    ...rest,
    headers: {
      ...rest.headers,
      ...corsHeaders
    },
  };
}
