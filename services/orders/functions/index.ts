import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { goToStep2 } from './client/goto-step2';
import { goToStep3 } from './client/goto-step3';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    debugger;
    console.log('lambda my start 123');
    console.log(event);
    console.log(context);
    switch (event.httpMethod) {
        case 'POST':
            switch (event.path) {
                case '/orders/client/go-to-step2':
                    return await goToStep2(event);
                case '/orders/client/go-to-step3':
                    return await goToStep3(event);
            }
    }
};