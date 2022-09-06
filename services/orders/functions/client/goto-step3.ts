/* eslint-disable @typescript-eslint/ban-ts-comment */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB, GetItemInput, UpdateItemInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { TranscriptOrder, TranscriptOrderSection, Spelling } from '../../models/order.model';

interface Request {
    orderNumber: string;
    sections: TranscriptOrderSection[];
    spellings: Spelling[];
    isEnglish: boolean;
    isFrench: boolean;
}

export async function goToStep3(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const { body } = event;

    if (!body) {
        return sendFail('invalid request');
    }

    const request = JSON.parse(body) as Request;

    // retrieve username from auth
    const username = 'imaanvirbrar';

    const dynamoClient = new DynamoDB({
        region: 'ca-central-1',
    });

    const getParams: GetItemInput = {
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
        const order: TranscriptOrder = getResult.Item ? unmarshall(getResult.Item) : null;

        order.sections = request.sections;
        order.spellings = request.spellings;
        order.isEnglish = request.isEnglish;
        order.isFrench = request.isFrench;
        order.updatedTime = new Date();
        order.updatedBy = username;

        const updateParams: UpdateItemInput = {
            Key: {
                ClientId: {
                    S: username,
                },
                OrderNumber: {
                    S: request.orderNumber,
                },
            },
            TableName: 'TranscriptOrder',
            UpdateExpression:
                'set sections = :sections, spellings = :spellings, isEnglish = :isEnglish, isFrench = :isFrench, updatedTime = :updatedTime, updatedBy = :updatedBy',
            ExpressionAttributeValues: marshall({
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
    } catch (err) {
        console.log(err);

        return sendFail('something went wrong');
    }
}

function sendFail(message: string): APIGatewayProxyResult {
    return {
        statusCode: 400,
        body: JSON.stringify({ message }),
    };
}
