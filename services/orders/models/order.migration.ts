import { Migration } from '../../../libs/db/src/lib/migration';
import { ITranscriptOrder, TranscriptOrder } from './order.model';
import { InputKey } from 'dynamoose/dist/General';

export var CURRENT_VERSION = 0;

export const MIGRATIONS: Migration[] = [
    {
        Version: 1,
        Description: 'Update draft status to pending',
        DateTime: new Date(),
        Table: 'orders',
        Migrate: async function(primaryKey: InputKey): Promise<ITranscriptOrder> {
            // Update draft status to pending
            const order = new TranscriptOrder();
            const item = await order.model.get(primaryKey);
            item.status = 'pending';
            item.version = 1;
            item.save();
            return item;
        },
        Rollback: async function(primaryKey: InputKey): Promise<ITranscriptOrder> {
            // Update draft status to pending
            const order = new TranscriptOrder();
            const item = await order.model.get(primaryKey);
            item.status = 'draft';
            item.save();
            return item;
        },
    }
];