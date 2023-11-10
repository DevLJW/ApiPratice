import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    //strategy 타입반환
    constructor() {
        //  검증부분이 부모로 넘어가서 부모에서 검증이 이루어지게 된다.
        //  비밀번호 검증과 만료시간 검증 2가지를 한다.
        super({
            // gql-auth.guards에서 return한 값이 여기 들어오게 된다.
            jwtFromRequest: (req) => {
                console.log(req);
                const cookie = req.headers.cookie; //  refreshToken=dasdwadsawd
                const accessToken = cookie.replace(`refreshToken=`, '');
                return accessToken;
            }, // accessToken 넣어주기

            secretOrKey: '나의리프레시비밀번호',

            // context 안의 req에 user라는 이름으로 email과 id 정보가 담긴
            // 객체를 user 안으로 return 되는 것입니다 (passport에서 user를 자동으로 만들어 주기에, 바꿀 수 없습니다).
        });
    }

    //  성공시, validate()가 실행된다. 토큰을 열었을때 나오는값(userid)가 payload에 들어오게 된다.
    validate(payload) {
        return {
            //context로 반환된다.
            id: payload.sub,
        };
    }
}
