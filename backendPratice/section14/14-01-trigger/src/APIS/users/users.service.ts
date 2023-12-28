import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
    IAuthServiceFetchUser,
    IUsersServiceCreate,
    IUsersServiceFindOneByEmail,
} from './interfaces/users-service.interfaces';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
        // 충돌검증함수
        return this.usersRepository.findOne({ where: { email } });
    }

    async create({
        email,
        password,
        name,
        age,
    }: IUsersServiceCreate): Promise<User> {
        //  1. 충돌 검증 하기
        const user = await this.findOneByEmail({ email });
        if (user) throw new ConflictException('이미등록된 이메일 입니다.');

        //  2. 비밀번호 암호화(해시(단방향))으로 변환해서 저장하기

        /*  양방향 : 890907 -> hijijg(암호화)    hijijg -> 890907(복호화) 
            단방향(해시) :  890907  --> 997(암호화) 997 -> 890907복호화 과정에서 10으로 나눴을때 997이 되는 수는 굉장히 많음(ex: 090907,190907) 
                           레인보우 테이블을 만들어 무차별 대입공격을 하면 뚫릴수도 있다.
                           salt를 반복적으로 쳐서 무차별 대입공격을 막아야한다.
                           890907 + salt --> 반복  
        
        */

        const hashedPassword = await bcrypt.hash(password, 10); //해시서비스를 만들어 의존성주입을 시키는게 맞음

        return this.usersRepository.save({
            email: email,
            password: hashedPassword,
            name: name,
            age: age,
        });
    }

    async fetchUser({ id }: IAuthServiceFetchUser): Promise<User> {
        return await this.usersRepository.findOne({ where: { id } });
    }
}
