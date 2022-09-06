/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DynamoDB, QueryInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export async function GenerateOrderNumber(): Promise<string> {
    const dynamoClient = new DynamoDB({
        region: 'ca-central-1',
    });

    // get the latest order number from orders table
    const qParams: QueryInput = {
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
    const orderNumber: string = result.Count > 0 ? unmarshall(result.Items[0]).orderNumber : null;
    let number = 0;
    let stringNumber = '';
    if (orderNumber) {
        // get number from the formatted order number and increment it by 1
        number = Number(orderNumber.substring(orderNumber.indexOf('-') + 1)) + 1;
        // convert number back to 6 digit string TDS-xxxxxx
        stringNumber = 'TDS-' + number.toString().padStart(6, '0');
    } else stringNumber = 'TDS-000001';

    return stringNumber;
}
