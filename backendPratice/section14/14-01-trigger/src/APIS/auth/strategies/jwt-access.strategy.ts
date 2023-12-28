import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
let accessToken: string;
let refreshToken: string;

import * as jwt from 'jsonwebtoken';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    //strategy 타입반환

    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        //  검증부분이 부모로 넘어가서 부모에서 검증이 이루어지게 된다.
        //  비밀번호 검증과 만료시간 검증 2가지를 한다.
        //  리턴하여 개발자가 필요한곳에 저장하기
        // super({
        //     //  gql-auth.guards에서 return한 값이 여기 들어오게 된다.
        //     // jwtFromRequest: (req) => {
        //  const temp = req.headers.Authorization; //  Bearer aslkjd
        //     //     const accessToken = temp.toLowercase().rep lace('bearer ', '');
        //     //     return accessToken;
        //     // }, // accessToken 넣어주기
        //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //헤더의 Authorization 헤더 데이터 가져오기
        //     secretOrKey: '나의비밀번호',

        //     // context 안의 req에 user라는 이름으로 email과 id 정보가 담긴
        //     // 객체를 user 안으로 return 되는 것입니다 (passport에서 user를 자동으로 만들어 주기에, 바꿀 수 없습니다).
        // });

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            secretOrKey: '나의비밀번호',
            passReqToCallback: true,
        });
    }

    //  성공시, validate()가 실행된다. 토큰을 열었을때 나오는값(userid)가 payload에 들어오게 된다.
    async validate(req: Request, payload) {
        // 액세스 토큰

        const accessToken = req.headers.authorization.replace('Bearer ', '');
        // 리프레시 토큰
        const refreshToken = req.headers.cookie.replace(`refreshToken=`, '');

        // req에서 엑세스 토큰을 꺼내어 레디스에 해당 토큰이 있는지 확인한다.

        const key = await this.cacheManager.get(`accesstoken:${accessToken}`); //  key를 조회해서 value를 가져오기

        if (key === 'accesstoken')
            throw new UnauthorizedException(
                '이미 로그아웃된 토큰 입니다. 다른 액세스 토큰을 발급해주세요.',
            );

        // 저장되어 있다면 UnauthorizedException 발생 시키기 --> 로그아웃했다는 기록의 토큰을 제공 했으므로,

        return {
            //인가한 데이터들 반환 해주기
            id: payload.sub,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
}
