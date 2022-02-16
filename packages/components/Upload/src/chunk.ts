import {
    UploadFileStatus,
    UploadFile
} from './interface'

/**
 * 获取切片
 * @param file
 */
export const getChunk = async (file: File | Blob, chunkSize: number)=>{
    return new Promise<UploadFile>(resolve => {
        const filesize = file.size
        const filename = (file as File).name || 'unknown'
        // 计算文件切片总数
        const total = Math.ceil(filesize / chunkSize)
        const chunks: UploadFile[] = []
        let start = 0
        let end = 0
        let index = 0
        const now = Date.now()
        while(start < filesize) {
            end = start + chunkSize
            if(end > filesize) {
                end = filesize;
            }
            index++;
            chunks.push({
                name: `${filename}-${now}-chunk-${index}`,
                progress:0,
                file: file.slice(start, end),
                isChunk: true,
                status: UploadFileStatus.Waiting,
                pin: true
            })
            start = end
        }
        const resUlt: UploadFile = {
            name: filename,
            progress: 0,
            chunks,
            file,
            total,
            status: UploadFileStatus.Waiting
        }
        resolve(resUlt)
    })
}