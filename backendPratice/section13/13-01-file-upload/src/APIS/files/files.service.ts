import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

interface IFileServiceUpload {
    file: FileUpload;
}

@Injectable()
export class FilesService {
    upload({ file }: IFileServiceUpload): string {
        // 1. 파일을 클라우드 스토리지에 저장하는 로직
        console.log(file);

        //  1.1 스토리지 세팅하기
        const storage = new Storage({
            projectId: 'backend-404303',
            keyFilename: 'gcp-file-storage.json',
        }).bucket('exbackend-storage'); //버킷 : 폴더

        //  1.2 스토리지에 파일 업로드하기

        file.createReadStream()
            .pipe(storage.file(file.filename).createWriteStream())
            .on('finish', () => {
                console.log('성공');
            })
            .on('error', () => {
                console.log('실패');
            });

        console.log('파일 전송이 완료 되었습니다.');
        return '끝';
    }
}
