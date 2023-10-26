import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

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
}
