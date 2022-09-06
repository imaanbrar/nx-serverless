"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const goto_step2_1 = require("./client/goto-step2");
const goto_step3_1 = require("./client/goto-step3");
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const lambdaHandler = async (event, context) => {
    console.log('lambda my start 123');
    console.log(context);
    switch (event.httpMethod) {
        case 'POST':
            switch (event.path) {
                case '/orders/client/go-to-step2':
                    return await (0, goto_step2_1.goToStep2)(event);
                case '/orders/client/go-to-step3':
                    return await (0, goto_step3_1.goToStep3)(event);
            }
    }
};
exports.lambdaHandler = lambdaHandler;
//# sourceMappingURL=index.js.map