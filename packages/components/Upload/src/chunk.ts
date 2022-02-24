import {
    UploadFileStatus,
    UploadFile
} from './interface'
import sparkMD5 from 'spark-md5'

export const getBlobMd5 = (file: File | Blob) => {
    return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(file)
        fileReader.onloadend = () => {
            if (typeof fileReader.result !== 'string') {
                reject()
                return
            }
            const md5 = sparkMD5.hashBinary(fileReader.result)
            resolve(md5)
        }
    })
}

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
            const fileSlice = file.slice(start, end)
            const chunk = {
                name: `${filename}-${now}-chunk-${index}`,
                progress: 0,
                file: fileSlice,
                isChunk: true,
                status: UploadFileStatus.Waiting,
                pin: true,
                md5: ''
            }
            chunks.push(chunk)
            getBlobMd5(fileSlice)
                .then(res => {
                    chunk.md5 = res
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