import { ExceptionFilter, HttpException, Catch } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException) {
        const status = exception.getStatus(); //오류난 상태 가져오기
        const message = exception.message; //오류난 메세지 가져오기

        console.log('오류내용');
        console.log(status);
        console.log(message);
    }
}
