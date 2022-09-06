"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goToStep2 = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const generate_order_number_1 = require("./generate-order-number");
async function goToStep2(event) {
    console.log('lambda stet go to step 2');
    const { body } = event;
    if (!body) {
        return sendFail('invalid request');
    }
    let request = null;
    if (typeof body === 'string')
        request = JSON.parse(body);
    else
        request = body;
    // retrieve username from auth
    const username = 'imaanvirbrar';
    // generate order number
    const orderNumber = await (0, generate_order_number_1.GenerateOrderNumber)();
    // set status
    const status = 'Draft';
    const dynamoClient = new client_dynamodb_1.DynamoDB({
        region: 'ca-central-1',
    });
    const newOrder = {
        orderNumber: orderNumber,
        customerId: username,
        status: status,
        caseNumbers: request.caseNumbers,
        styleOfCause: request.styleOfCause,
        levelOfCourt: request.levelOfCourt,
        matterType: request.matterType,
        courtLocationId: request.courtLocationId,
        courtRoomId: request.courtRoomId,
        proceedingDate: request.proceedingDate,
        judiciarySpelling: request.judiciarySpelling,
        areChildrenInvolved: request.areChildrenInvolved,
        orderingUserRole: request.orderingUserRole,
        sections: null,
        spellings: null,
        isEnglish: false,
        isFrench: true,
        createdBy: username,
        createdDate: new Date(),
        updatedBy: username,
        updatedTime: new Date(),
    };
    const orderParams = {
        Item: (0, util_dynamodb_1.marshall)(newOrder, {
            convertClassInstanceToMap: true,
        }),
        TableName: 'order',
    };
    try {
        await dynamoClient.putItem(orderParams);
        return {
            statusCode: 200,
            body: JSON.stringify({ newOrder }),
        };
    }
    catch (err) {
        console.log(err);
        return sendFail('something went wrong');
    }
}
exports.goToStep2 = goToStep2;
function sendFail(message) {
    return {
        statusCode: 400,
        body: JSON.stringify({ message }),
    };
}
//# sourceMappingURL=goto-step2.js.map