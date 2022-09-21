// import { BaseItem, Model } from '@app/db/model';
import { BaseItem, Model } from '../../../libs/db/src/lib/model';
import * as dynamoose from 'dynamoose';
import { CURRENT_VERSION, MIGRATIONS } from './order.migration'
export class TranscriptOrder extends Model<ITranscriptOrder> {
    constructor() {
        super('order', TranscriptOrderSchema);
    }

    // get order by primary key - customerId and orderNumber
    async getOrder(customerId: string, orderNumber: string): Promise<ITranscriptOrder> {
        const key = { 'customerId': customerId, 'orderNumber': orderNumber };
        const result = await super.get(key);

        // perform migration if needed
        let migrationResult: ITranscriptOrder;
        if (result.version !== CURRENT_VERSION) {
            const migrations = MIGRATIONS.filter(x => x.Version > result.version);
            await migrations.forEach(async migration => {
                migrationResult = await migration.Migrate(key);
            });
            return migrationResult;
        }
        else
            return result;
    }

    // get (query) orders by partition key - customerId
    async queryOrdersByCustomer(customerId: string): Promise<ITranscriptOrder[]> {
        return await super.query('customerId').eq(customerId).exec();
    }

    // get (query) orders by status - global secondary index
    async queryOrdersByStatus(status: string): Promise<ITranscriptOrder[]> {
        return await super.query('status').eq(status).using('status').exec();
    }
    
}

export const TranscriptOrderSchema = new dynamoose.Schema({
    orderNumber: String,
    customerId: String,
    status: String,
    
    caseNumbers: Array,
    styleOfCause: String,
    levelOfCourt: String,
    matterType: String,
    courtLocationId: String,
    courtRoomId: String,
    proceedingDate: Date,
    judiciarySpelling: String,
    areChildrenInvolved: Boolean,
    orderingUserRole: String,

    sections: [Object, dynamoose.type.NULL],
    spellings: [Object, dynamoose.type.NULL],
    isEnglish: Boolean,
    isFrench: Boolean,
}, {
    timestamps: true,
})

export interface ITranscriptOrder extends BaseItem {
    orderNumber: string;
    customerId: string;
    status: string;
    
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
    

    sections: TranscriptOrderSection[] | null;
    spellings: Spelling[] | null;
    isEnglish: boolean;
    isFrench: boolean;
}

export interface TranscriptOrderWorkflowStep {
    previousTranscriptWorkflowStepType: string;
    currentTranscriptWorkflowStepType: string;
    comment: string;
    dateTime: Date;
}

export interface TranscriptOrderSection {
    type: string;
    additionalInformation: string;
    timespans: TranscriptOrderSectionTimespan[];
}

export interface TranscriptOrderSectionTimespan {
    startTime: Date;
    endTime: Date;
}

export interface Spelling {
    spellingType: string;
    spellingTypeText: string;
    text: string;
}

export interface SupportingDocument {
    id: string;
    supportingDocumentTypes: string[];
    supportingDocumentTags: { [key: string]: string };
    supportingDocumentTypesText: string[];
    comment: string;
    fileType: string;
    fileName: string;
    internalFileName: string;
    externalReference: string;
    fileContents: ArrayBuffer;
    size: number;
}

export interface PackageFile {
    id: string;
    packageFileType: string;
    comment: string;
    fileType: string;
    fileName: string;
    filePath: string;
    internalFileName: string;
    fileContents: string;
    externalReference: string;
    size: number;
    isError: boolean;
    errorMessage: string;
}

export interface TranscriptDocument {
    id: string;
    transcriptDocumentType: string;
    comment: string;
    fileType: string;
    fileName: string;
    internalFileName: string;
    externalReference: string;
    fileContents: string;
    size: number;

    uploadingUserId: string;
    uploadingUserFullName: string;
    uploadingUserAccountType: string;
    uploadDateTime: Date;

    reviewingUserId: string;
    reviewingUserFullName: string;
    reviewOutcomeType: string;
    reviewCompletedDateTime: Date;
    reviewComment: string;

    totalValidCharacters: number;
    totalPages: number;
}

export interface TranscriptFollowerHistory {
    id: string;
    followerId: string;
    followerFullName: string;
    followerInitials: string;
    workInProgressName: string
    followerType: string;
    startDateTime: Date;
    endDateTime: Date;
    createdByFullName: string;
    createdDateTime: Date;
}