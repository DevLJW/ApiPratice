import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { BoardsService } from './boards.service';

import { CreateBoardInput } from './dto/create-board.input';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache, caching } from 'cache-manager';

// @Controller()
@Resolver() //   (Graphql 라이브러리)
export class BoardsResolver {
    constructor(
        //이곳에서 생성자를 생성하고 반환한다.
        private readonly boardsService: BoardsService, //
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    // @Get('/products/buy')
    @Query(() => String) //  grqphql return type //그래프QL 문서 타입 (Graphql 라이브러리)
    async fetchBoards(): Promise<string> {
        //  function return type
        // return this.boardsService.findAll();
        const mycache = await this.cacheManager.get('aaa');
        console.log(mycache);
        return '캐시에서 조회 완료';
    }

    @Mutation(() => String) //그래프QL 문서 타입 + Mutation의 기능도함(Graphql 라이브러리)
    async createBoard(
        // @Args('writer') //writer로 입력 받는다.
        // writer: string,
        // @Args('title') //writer로 입력 받는다.
        // title: string,
        // @Args({ name: 'contents', nullable: true }) //널값도 허용할떄
        // contents: string,
        @Args('createBoardInput') createBoardInput: CreateBoardInput,
    ): Promise<string> {
        // return this.boardsService.create({ createBoardInput }); //boardService의 리턴값을 받아 여기서 리턴을해줘야 브라우저까지 간다.

        await this.cacheManager.set('topteam1000', createBoardInput, {
            ttl: 1000,
        } as any);
        return '캐시에 등록완료';
    }
}
