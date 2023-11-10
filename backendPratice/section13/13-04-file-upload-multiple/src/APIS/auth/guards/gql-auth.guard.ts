import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

export const GqlAuthGuard = (name) => {
    return class GqlAuthAccessGuard extends AuthGuard(name) {
        getRequest(context: ExecutionContext) {
            //context: rest api를 사용할때 들어오는 context
            //  request를 변형해주는 역할

            const gqlContext = GqlExecutionContext.create(context); //graphql형식으로 변형
            return gqlContext.getContext().req; //  리턴할떄 AuthGuard('access')인걸 찾는다.  jwt-access-strategy파일
        }
    };
};
