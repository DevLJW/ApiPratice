import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/interfaces/context';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}
    @Mutation(() => String)
    login(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context() context: IContext,

        /*
    - `@Context()` : Request와 Response, header 등에 대한 정보들이 context에 존재   
       따라서 데코레이터를 통해 해당 context 정보를 가지고 올 수 있도록 설정해 줍니다.
        */
    ): Promise<string> {
        return this.authService.login({ email, password, context });
    }
}
