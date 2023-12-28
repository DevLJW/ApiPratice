import { Request, Response } from 'express';

export interface IAuthUser {
    user?: {
        id: string;
        accessToken?: string;
        refreshToken?: string;
    };
}

export interface IContext {
    //  리퀘스트가 있고 추가로 유저가 있을수도있고 없을수도 있다.
    //    req: Request  & {
    //         user? : {
    //             id : string
    //         }
    //    }

    req: Request & IAuthUser; //구글이나 카카오 다른 라이브러리 사용할때도 사용할 수 있음.
    res: Response;
}
