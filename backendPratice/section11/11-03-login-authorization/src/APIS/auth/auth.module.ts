import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt/dist';
import { UsersModule } from '../users/users.module';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
    imports: [UsersModule, JwtModule.register({})], //접근할 DB 테이블 작성하기, JWT모듈안에는 서비스도 내장되어있어서 서비스를 내장받을수 있다.
    providers: [AuthResolver, AuthService, JwtAccessStrategy],
})
export class AuthModule {}

/*
providers: Nest injector에 의해 인스턴스화되고, 최소 현재 모듈에서 공유될 provider의 집합
controllers: 인스턴스화해야 하는, 현재 모듈에 정의된 Controller의 집합
imports: 현재 모듈에서 필요한 provider들을 export한 import된 모듈의 집합
exports: 현재 모듈에 의해 제공되며 현재 모듈을 import하는 다른 모듈에서 사용할 수 있어야 하는 provider의 하위 집합

*/
