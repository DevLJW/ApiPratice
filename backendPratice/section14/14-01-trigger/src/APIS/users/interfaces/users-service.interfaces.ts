export interface IUsersServiceCreate {
    email: string;
    password: string;
    name: string;
    age: number;
}

export interface IUsersServiceFindOneByEmail {
    email: string;
}

export interface IAuthServiceLoginReturn {
    message: string;
    setRefreshToken: string;
    access_token: string;
}

export interface IAuthServiceFetchUser {
    id: string;
}
