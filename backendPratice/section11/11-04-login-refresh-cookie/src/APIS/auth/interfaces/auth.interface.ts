import { User } from 'src/APIS/users/entities/user.entity';
import { IContext } from 'src/commons/interfaces/context';

export interface IAuthServiceLogin {
    email: string;
    password: string;
    context: IContext;
}

export interface IAuthServiceGetAccessToken {
    user: User;
}

export interface IAuthServiceSetRefreshToken {
    user: User;
    context: IContext;
}
