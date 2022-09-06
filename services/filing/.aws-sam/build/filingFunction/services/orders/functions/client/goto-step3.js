"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goToStep3 = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
async function goToStep3(event) {
    const { body } = event;
    if (!body) {
        return sendFail('invalid request');
    }
    const request = JSON.parse(body);
    // retrieve username from auth
    const username = 'imaanvirbrar';
    const dynamoClient = new client_dynamodb_1.DynamoDB({
        region: 'ca-central-1',
    });
    const getParams = {
        Key: {
            clientId: {
                S: username,
            },
            orderNumber: {
                S: request.orderNumber,
            },
        },
        TableName: 'TranscriptOrder',
    };
    try {
        const getResult = await dynamoClient.getItem(getParams).then();
        // @ts-ignore
        const order = getResult.Item ? (0, util_dynamodb_1.unmarshall)(getResult.Item) : null;
        order.sections = request.sections;
        order.spellings = request.spellings;
        order.isEnglish = request.isEnglish;
        order.isFrench = request.isFrench;
        order.updatedTime = new Date();
        order.updatedBy = username;
        const updateParams = {
            Key: {
                ClientId: {
                    S: username,
                },
                OrderNumber: {
                    S: request.orderNumber,
                },
            },
            TableName: 'TranscriptOrder',
            UpdateExpression: 'set sections = :sections, spellings = :spellings, isEnglish = :isEnglish, isFrench = :isFrench, updatedTime = :updatedTime, updatedBy = :updatedBy',
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ':sections': request.sections,
                ':spellings': request.spellings,
                ':isEnglish': request.isEnglish,
                ':isFrench': request.isFrench,
                ':updatedTime': new Date(),
                ':updatedBy': username,
            }),
            ReturnValues: 'ALL_NEW',
        };
        const result = await dynamoClient.updateItem(updateParams).then();
        return {
            statusCode: 200,
            body: JSON.stringify({ result }),
        };
    }
    catch (err) {
        console.log(err);
        return sendFail('something went wrong');
    }
}
exports.goToStep3 = goToStep3;
function sendFail(message) {
    return {
        statusCode: 400,
        body: JSON.stringify({ message }),
    };
}
//# sourceMappingURL=goto-step3.js.map