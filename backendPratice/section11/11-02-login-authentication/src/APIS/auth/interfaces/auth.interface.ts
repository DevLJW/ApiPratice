import { User } from 'src/APIS/users/entities/user.entity';

export interface IAuthServiceLogin {
    email: string;
    password: string;
}

export interface IAuthServiceGetAccessToken {
    user: User;
}
