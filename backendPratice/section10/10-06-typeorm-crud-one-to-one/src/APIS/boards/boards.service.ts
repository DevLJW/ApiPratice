import { Injectable } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { IBoardServiceCreate } from './interfaces/boards-service.interface';

// 인젝션-스코프 --> 1.싱글톤(new 한번)으로 할래? 생략하면 싱글톤
//                  2.Request 스코프(매 요청마다) 할래?
//                  3.Transient 스코프(매 주입마다 new)로 할래 ?

@Injectable()
export class BoardsService {
    findAll(): Board[] {
        const result = [
            {
                number: 1,
                writer: '철수',
                title: '제목입니다~~',
                contents: '내용이에요@@@',
            },
            {
                number: 2,
                writer: '영희',
                title: '영희 제목입니다~~',
                contents: '영희 내용이에요@@@',
            },
            {
                number: 3,
                writer: '훈이',
                title: '훈이 제목입니다~~',
                contents: '훈이 내용이에요@@@',
            },
        ];

        return result;
    }

    create({ createBoardInput }: IBoardServiceCreate): string {
        console.log(createBoardInput.writer);
        console.log(createBoardInput.title);
        console.log(createBoardInput.contents);
        return '게시물 등록에 성공 하였습니다.';
    }
}
