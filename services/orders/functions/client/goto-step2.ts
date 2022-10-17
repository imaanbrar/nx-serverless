import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ITranscriptOrder, TranscriptOrder } from '../../models/order.model';
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

export async function goToStep2(body: string): Promise<Record<string, any>> {

    let request: Request = null;

    if (typeof body === 'string') request = JSON.parse(body) as Request;
    else request = body;

    console.log(body);

    // retrieve username from auth
    const username = 'imaanvirbrar';

    // generate order number
    const orderNumber = await GenerateOrderNumber();

    // set status
    const status = 'Draft';

    const order = new TranscriptOrder();

    const item = order.item({
        orderNumber: orderNumber,
        customerId: username,
        status: status,
        caseNumbers: request.caseNumbers,
        styleOfCause: request.styleOfCause,
        levelOfCourt: request.levelOfCourt,
        matterType: request.matterType,
        courtLocationId: request.courtLocationId,
        courtRoomId: request.courtRoomId,
        proceedingDate: new Date(request.proceedingDate),
        judiciarySpelling: request.judiciarySpelling,
        areChildrenInvolved: Boolean(request.areChildrenInvolved),
        orderingUserRole: request.orderingUserRole,

        sections: null,
        spellings: null,
        isEnglish: false,
        isFrench: true,
    });
    
    await order.create(item);

    return item;
}
