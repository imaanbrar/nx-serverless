"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateOrderNumber = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
async function GenerateOrderNumber() {
    const dynamoClient = new client_dynamodb_1.DynamoDB({
        region: 'ca-central-1',
    });
    // get the latest order number from orders table
    const qParams = {
        KeyConditionExpression: 'customerId = :customerId',
        ExpressionAttributeValues: {
            ':customerId': { S: 'imaanvirbrar' },
        },
        TableName: 'order',
        ScanIndexForward: false,
        Limit: 1,
    };
    const result = await dynamoClient.query(qParams).then();
    // @ts-ignore
    const orderNumber = result.Count > 0 ? (0, util_dynamodb_1.unmarshall)(result.Items[0]).orderNumber : null;
    let number = 0;
    let stringNumber = '';
    if (orderNumber) {
        // get number from the formatted order number and increment it by 1
        number = Number(orderNumber.substring(orderNumber.indexOf('-') + 1)) + 1;
        // convert number back to 6 digit string TDS-xxxxxx
        stringNumber = 'TDS-' + number.toString().padStart(6, '0');
    }
    else
        stringNumber = 'TDS-000001';
    return stringNumber;
}
exports.GenerateOrderNumber = GenerateOrderNumber;
//# sourceMappingURL=generate-order-number.js.map