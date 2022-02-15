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

export type getChunk = (file:File)=>Promise<ChunkItem>;

export type ChunkItem = {
    isChunk:boolean;
    name:string;
    filename:string;
    progress:number;
    show:boolean;
    chunk:ChunkItemChunks;
    file:File;
    total:number;
}

export type ChunkItemChunks = ChunkItemChunksItem[];
export type ChunkItemChunksItem = {
    filename:string;
    progress:number;
    index:number;
    file:File, //切割文;
    end:boolean;
    start:boolean;
    cancel:any;
    complete:boolean;
    error:boolean;
    isChunk:boolean;
    now:number;
};

export type handleUploadChunkBefore<T = FileList | File[]> = (uploadFiles: T)=>Promise<T>;
