import {
    Inject,
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import {
    IAuthServiceGetAccessToken,
    IAuthServiceLogin,
    IAuthServiceLogout,
    IAuthServiceRestoreAccessToken,
    IAuthServiceSetRefreshToken,
} from './interfaces/auth.interface';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { IContext } from 'src/commons/interfaces/context';
import { Cache } from 'cache-manager';
import path from 'path';

@Injectable()
export class AuthService {
    // accessToken은 변수에 담아서 브라우저에 던져준다.(추후, 프론트엔드개발자가 사용 로컬스토리지 변수에 넣어 사용)
    // RefreshToken은 헤더에 담아서 브라우저의 쿠키에 넣어준다.

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}
    async login({ email, password, context }: IAuthServiceLogin): Promise<any> {
        // 1. 이메일이 일치하는 유저를 DB에서 찾기
        const user = await this.usersService.findOneByEmail({ email });

        // 2. 일치하는 유저가 없으면 에러 던지기
        if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

        //유저가 입력한 패스워드와 데이터베이스에 암호화 되어있는 패스워드를 비교하여 동일한지 비교해준다.(동기)
        const isAuth = await bcrypt.compare(password, user.password);
        //  3. 일치하는 유저는 있지만 패스워드가 틀렸다면, 에러 던지기
        if (!isAuth)
            throw new UnprocessableEntityException('패스워드가 틀렸습니다.');

        // 4. RefreshToken을 만들어서 프론트엔드 브라우저 쿠키에 저장해서 보내주기

        this.setRefreshToken({ user, context });
        return this.getAccessToken({ user, context }); //바디가 리턴될때 헤더(setRefreshToken)도 같이 들어간다
        //  4.  일치하는 유저도 있고, 비밀번호도 맞았다면 ? => accessToken(=JWT)을 만들어서 브라우저에 전달하기
    }

    //
    //
    // AcceessToken 재발급 함수
    restoreAccessToken({
        user,
        context,
    }: IAuthServiceRestoreAccessToken): string {
        return this.getAccessToken({ user, context });
    }
    //  RefreshToken생성
    async setRefreshToken({ user, context }: IAuthServiceSetRefreshToken) {
        const refreshToken = this.jwtService.sign(
            { sub: user.id }, //  secret는 서명을 만들 때 사용되는 암호 문자열입니다.
            { secret: '나의 리프레시 비밀번호', expiresIn: '2w' },
        );

        context.res.setHeader(
            //ㅎ
            //  바디가 리턴될때 헤더도 같이 리턴된다. getAccessToken은 바디로 리턴된다.
            'set-Cookie',
            `refreshToken=${refreshToken}; path=/; `,
        );

        //  배포 환경
        //  domain=.mybacksite.com; SameSite=None Secure; httpOnly
        // context.res.setHeader('Access-Control', 'https://myfrontsite.com'); //접근가능자

        return refreshToken;
    }

    //  AcceessToken 생성
    getAccessToken({ user, context }: IAuthServiceGetAccessToken): string {
        //  토큰 생성 메소드
        //  생성 후, 브라우저에 토큰던져주기
        //  그후, 받은 토큰을 프론트엔드 개발자가 저장하여 사용하기
        const accessToken = this.jwtService.sign(
            { sub: user.id },
            //  서명된 JWT를 생성할 때 사용하는 키(암호화와 복호화에서 사용되는 키)
            { secret: '나의비밀번호', expiresIn: '1h' },
        );

        // context.res.setHeader(
        //     //  바디가 리턴될때 헤더도 같이 리턴된다. getAccessToken은 바디로 리턴된다.
        //     'Authorization',
        //     `Bearer` + accessToken,
        // );

        // context.res.appendHeader(
        //     //  바디가 리턴될때 헤더도 같이 리턴된다. getAccessToken은 바디로 리턴된다.
        //     'set-Cookie',
        //     `accessToken=${accessToken}; path=/; `,
        // );

        return accessToken;
    }

    logout({ context }: IAuthServiceLogout) {
        //검증

        const accessverify = this.jwtService.verify(
            //토큰 검증
            context.req.user.accessToken,
            {
                // 복호화
                secret: '나의비밀번호',
            },
        );

        const refreshverify = this.jwtService.verify(
            //토큰 검증
            context.req.user.refreshToken,
            {
                // 복호화
                secret: '나의 리프레시 비밀번호',
            },
        );

        this.cacheManager.set(
            `accesstoken:${context.req.user.accessToken}`,
            'accesstoken',
            { ttl: accessverify.exp - accessverify.iat } as any, //  초로 계산이 된다. 만료초에서 시작초 값 뺴주기
            // ttl : 토큰 만료 시간이 지나면 redis에서 해당 토큰은 자동으로 삭제되도록 설정
            // 만료된 Token은 Redis에서 자동으로 삭제된다.
        );

        this.cacheManager.set(
            `refreshtoken:${context.req.user.refreshToken}`,
            'refreshtoken',
            {
                ttl: refreshverify.exp - refreshverify.iat,
            } as any,
        );

        // 레디스에 액세스 토큰 저장하는 부분

        // 레디스에 리프레시 토큰 저장하는 부분

        return '로그아웃에 성공 하였습니다.';
    }
}
