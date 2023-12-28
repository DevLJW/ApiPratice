import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UnauthorizedException } from '@nestjs/common';
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    //strategy 타입반환
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        //  검증부분이 부모로 넘어가서 부모에서 검증이 이루어지게 된다.
        //  비밀번호 검증과 만료시간 검증 2가지를 한다.
        //  브라우저의 쿠키로 전송
        super({
            // gql-auth.guards에서 return한 값이 여기 들어오게 된다.
            jwtFromRequest: (req) => {
                console.log(req);
                const cookie = req.headers.cookie; //  refreshToken=dasdwadsawd
                const refreshToken = cookie.replace(`refreshToken=`, '');
                return refreshToken;
            }, // accessToken 넣어주기

            secretOrKey: '나의 리프레시 비밀번호',
            passReqToCallback: true,
            // context 안의 req에 user라는 이름으로 email과 id 정보가 담긴
            // 객체를 user 안으로 return 되는 것입니다 (passport에서 user를 자동으로 만들어 주기에, 바꿀 수 없습니다).
        });
    }

    //  성공시, validate()가 실행된다. 토큰을 열었을때 나오는값(userid)가 payload에 들어오게 된다.
    async validate(req: Request, payload) {
        const refreshToken = req.headers.cookie.replace(`refreshToken=`, '');
        const key = await this.cacheManager.get(`refreshtoken:${refreshToken}`); //  key를 조회해서 value를 가져오기

        if (key === 'refreshtoken')
            throw new UnauthorizedException(
                '이미 로그아웃된 토큰 입니다. 다른 리프레시 토큰을 발급해주세요.',
            );

        return {
            //context로 반환된다.
            id: payload.sub,
        };
    }
}
