import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB, PutItemInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { TranscriptOrder } from '../../models/order.model';
import { GenerateOrderNumber } from './generate-order-number';

interface Request {
    caseNumbers: string[];
    styleOfCause: string;
    levelOfCourt: string;
    matterType: string;
    courtLocationId: string;
    courtRoomId: string;
    proceedingDate: Date;
    judiciarySpelling: string;
    areChildrenInvolved: boolean;
    orderingUserRole: string;
}

export async function goToStep2(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    console.log('lambda stet go to step 2');

    const { body } = event;

    if (!body) {
        return sendFail('invalid request');
    }

    let request: Request = null;

    if (typeof body === 'string') request = JSON.parse(body) as Request;
    else request = body;

    // retrieve username from auth
    const username = 'imaanvirbrar';

    // generate order number
    const orderNumber = await GenerateOrderNumber();

    // set status
    const status = 'Draft';

    const dynamoClient = new DynamoDB({
        region: 'ca-central-1',
    });

    const newOrder: TranscriptOrder = {
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

    const orderParams: PutItemInput = {
        Item: marshall(newOrder, {
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
