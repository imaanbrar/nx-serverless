/* eslint-disable @typescript-eslint/ban-ts-comment */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
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

    try {
        const order = new TranscriptOrder();
        const item = await order.getOrder(username, request.orderNumber);

        item.sections = request.sections;
        item.spellings = request.spellings;
        item.isEnglish = request.isEnglish;
        item.isFrench = request.isFrench;

        order.saveItem(item);

        return {
            statusCode: 200,
            body: JSON.stringify(item),
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
