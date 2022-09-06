import { BaseEntity } from '@app/db/base-entity';

export interface TranscriptOrder extends BaseEntity {
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