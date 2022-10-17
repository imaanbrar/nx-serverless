import {
  APIGatewayProxyEventV2WithLambdaAuthorizer,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';
import { goToStep2 } from './client/goto-step2';
import { goToStep3 } from './client/goto-step3';
import {
  API_ORDERS_GO_TO_STEP_2,
  API_ORDERS_GO_TO_STEP_3,
  getControllers,
} from '../../auth/authorizer/permissions';
import { httpError, httpResponse } from '../../../libs/http/src/lib/response';
import { IUserContext, UserContext } from '../../auth/authorizer/user-context';

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
  event: APIGatewayProxyEventV2WithLambdaAuthorizer<IUserContext>,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
debugger;
  console.log('orders lambda start');
  console.log(event);
  console.log(context);

  UserContext.context = event.requestContext.authorizer.lambda;

  const controller = getControllers(
    event.requestContext.http.path,
    event.requestContext.http.method 
  );

  console.log(controller);

  try {
    switch (controller) {
      case API_ORDERS_GO_TO_STEP_2:
        return httpResponse(await goToStep2(event.body));
      case API_ORDERS_GO_TO_STEP_3:
        return httpResponse(await goToStep3(event.body));
    }
  } catch (e) {
    return httpError(e);
  }
};