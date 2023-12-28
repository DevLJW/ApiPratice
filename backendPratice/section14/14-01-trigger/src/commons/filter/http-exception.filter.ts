import { ExceptionFilter, HttpException, Catch } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    //HTTP Exception 유형 및 그 하위클래스의 예외를 처리하는 내장된 전역 예외 필터에
    catch(exception: HttpException) {
        const status = exception.getStatus(); //오류난 상태 가져오기
        const message = exception.message; //오류난 메세지 가져오기

        console.log('오류내용');
        console.log(status);
        console.log(message);
    }
}
