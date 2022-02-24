export enum UploadFileStatus {
    Success,
    Waiting,
    Loading,
    Fail
}

export interface UploadFile {
    name: string,
    status?: UploadFileStatus,
    file?: File | Blob,
    pin?: boolean,
    url?: string,
    progress?: number,
    isChunk?: boolean,
    chunks?: UploadFile[],
    md5?: string,
    [x: string]: any
}
