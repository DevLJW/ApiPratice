import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/create-board.input';

// @Controller()
@Resolver() //   (Graphql 라이브러리)
export class BoardsResolver {
    constructor(
        //이곳에서 생성자를 생성하고 반환한다.
        private readonly boardsService: BoardsService, //
    ) {}

    // @Get('/products/buy')
    @Query(() => [Board], { nullable: true }) //  grqphql return type //그래프QL 문서 타입 (Graphql 라이브러리)
    fetchBoards(): Board[] {
        //  function return type
        return this.boardsService.findAll();
    }

    @Mutation(() => String) //그래프QL 문서 타입 + Mutation의 기능도함(Graphql 라이브러리)
    createBoard(
        // @Args('writer') //writer로 입력 받는다.
        // writer: string,
        // @Args('title') //writer로 입력 받는다.
        // title: string,
        // @Args({ name: 'contents', nullable: true }) //널값도 허용할떄
        // contents: string,
        @Args('createBoardInput') createBoardInput: CreateBoardInput,
    ): string {
        return this.boardsService.create({ createBoardInput }); //boardService의 리턴값을 받아 여기서 리턴을해줘야 브라우저까지 간다.
    }
}
