export enum UploadFileStatus {
    Success,
    Waiting,
    Loading,
    Fail
}

export interface UploadFile {
    name: string,
    status?: UploadFileStatus,
    file?: File,
    pin?: boolean,
    url?: string,
    progress?: number,
    [x: string]: any
}