import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

interface IFileServiceUpload {
    files: FileUpload[];
}

@Injectable()
export class FilesService {
    async upload({ files }: IFileServiceUpload): Promise<string[]> {
        // 1. 파일을 클라우드 스토리지에 저장하는 로직
        console.log("파일내용")
        console.log(files);

        const waitedFiles = [];
        waitedFiles[0] = await files[0];
        waitedFiles[1] = await files[1];

        //  1.1 스토리지 세팅하기
        const storage = new Storage({
            projectId: 'backend-404303',
            keyFilename: 'gcp-file-storage.json',
        }).bucket('exbackend-storage'); //버킷 : 폴더

        const results = [];

        for (let i = 0; waitedFiles.length; i++) {
            //  1.2 스토리지에 파일 업로드하기
            results[i] = await new Promise((resolve, reject) => {
                waitedFiles[i]
                    .createReadStream()
                    .pipe(
                        storage
                            .file(waitedFiles[i].filename)
                            .createWriteStream(),
                    )
                    .on('finish', () => {
                        resolve('성공');
                    })
                    .on('error', () => {
                        reject('실패');
                        reject();
                    });
            });
        }

        console.log('파일 전송이 완료 되었습니다.');
        return ['R', 'R'];
    }
}
