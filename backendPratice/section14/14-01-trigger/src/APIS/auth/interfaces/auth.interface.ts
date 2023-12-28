import { User } from 'src/APIS/users/entities/user.entity';
import { IAuthUser, IContext } from 'src/commons/interfaces/context';

export interface IAuthServiceLogin {
    email: string;
    password: string;
    context: IContext;
}

export interface IAuthServiceGetAccessToken {
    user: User | IAuthUser['user'];
    context: IContext;
}

export interface IAuthServiceSetRefreshToken {
    user: User;
    context: IContext;
}

export interface IAuthServiceRestoreAccessToken {
    user: IAuthUser['user'];
    context: IContext;
}

export interface IAuthServiceLogout {
    context: IContext;
}
