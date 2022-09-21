import { InputKey } from "dynamoose/dist/General";
import { BaseItem, Model } from "./model";

export interface Migration {
    Version: number,
    Description: string,
    DateTime: Date,
    Table: 'orders' | 'payments_history' | 'filing',
    Migrate: (primaryKey: any) => Promise<any>,
    Rollback: (primaryKey: any) => Promise<any>,
}