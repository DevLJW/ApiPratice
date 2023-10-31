import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';

import { GqlAuthAccessGuard } from '../auth/guards/gql-auth.guard';
import { IContext } from 'src/commons/interfaces/context';

@Resolver()
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Mutation(() => User)
    createUser(
        //grahql type으로 받은 email을 email 변수에 넣어준다.
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('name') name: string,
        @Args({ name: 'age', type: () => Int }) age: number,
    ): Promise<User> {
        return this.usersService.create({ email, password, name, age });
    }

    //  API 요청이 들어오면 UseGuards(인가)가 먼저 실행된다. 그후 성공하면 아래로직 실패면 에러가 뜬다.
    @UseGuards(GqlAuthAccessGuard) //인가하기전 검증하는 라이브러리
    @Query()
    fetchUser(@Context() context: IContext): string {
        //내 정보 가져오기
        console.log(context.req.user);

        return '인가에 성공 하셨습니다.';
    }
}
