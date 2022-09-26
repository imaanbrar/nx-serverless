// import { BaseItem, Model } from '@app/db/model';
import { BaseItem, Model } from '../../../libs/db/src/lib/model';
import * as dynamoose from 'dynamoose';

export class Audit extends Model<IAudit> {
    constructor() {
        super('audit', AuditSchema);
    }

    // get audit history for orders
    async getAuditHistoryForOrders(uId: string): Promise<IAudit> {
        const key: string = `order-${uId}`;
        const result = await super.get(key);
        return result;
    }

    // todo - get audit history for users
    
}

export const AuditSchema = new dynamoose.Schema({
    tableAndUId: String,
    timestamp: String,
    table: String,
    
    tableItemUId: String,
    action: String,
    actionInnerHtml: String,
    user: Object,
    updates: Object,
}, {
    timestamps: true,
})

export interface IAudit extends BaseItem {
    tableAndUId: string, // partition key
    timestamp: string, // sort key
    table: string, // name of the table that this item is associated with. Ex. orders
    tableItemUId: string // UId of the table's record that we are storing history on\
    action: string, // action that user performed. Ex. Place Order
    actionInnerHtml: string,
    user: {
        id: string,
        fullName: string,
        intitals: string,
        role: string,
    },
    updates: Object // Json of all the updates made 
}