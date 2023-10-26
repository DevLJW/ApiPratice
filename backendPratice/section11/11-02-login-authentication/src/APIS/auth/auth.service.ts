import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
    IAuthServiceGetAccessToken,
    IAuthServiceLogin,
} from './interfaces/auth.interface';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}
    async login({ email, password }: IAuthServiceLogin): Promise<string> {
        // 1. 이메일이 일치하는 유저를 DB에서 찾기
        const user = await this.usersService.findOneByEmail({ email });

        // 2. 일치하는 유저가 없으면 에러 던지기
        if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

        //유저가 입력한 패스워드와 데이터베이스에 암호화 되어있는 패스워드를 비교하여 동일한지 비교해준다.(동기)
        const isAuth = await bcrypt.compare(password, user.password);
        //  3. 일치하는 유저는 있지만 패스워드가 틀렸다면, 에러 던지기
        if (!isAuth)
            throw new UnprocessableEntityException('패스워드가 틀렸습니다.');

        //  4.  일치하는 유저도 있고, 비밀번호도 맞았다면 ? => accessToken(=JWT)을 만들어서 브라우저에 전달하기
        return this.getAccessToken({ user });
    }

    getAccessToken({ user }: IAuthServiceGetAccessToken): string {
        //  토큰 생성 메소드
        return this.jwtService.sign(
            { sub: user.id },
            { secret: '나의비밀번호', expiresIn: '1h' },
        );
    }
}
