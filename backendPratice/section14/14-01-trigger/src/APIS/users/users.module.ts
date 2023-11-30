import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersResolver, UsersService],
    exports: [UsersService], //모듈 내부에 가지고 있는 UsersService내보내기
})
export class UsersModule {}
