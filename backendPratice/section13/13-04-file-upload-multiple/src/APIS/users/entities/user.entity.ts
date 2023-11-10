import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'; //typeorm : 변환도구

@Entity() //테이블로 변환하기
@ObjectType() //  리턴타입
export class User {
    //graphql Type : 프론트엔드랑 데이터를 주고받기위한 데이터 타입

    @PrimaryGeneratedColumn('uuid') //기본키로 변환된다.
    @Field(() => String)
    id: string;

    @Column() //테이블의 컬럼으로 변환
    @Field(() => String)
    email: string;

    @Column() //테이블의 컬럼으로 변환
    // @Field(() => String) //비밀번호는 브라우저에 전달하지않음
    password: string;

    @Column() //테이블의 컬럼으로 변환
    @Field(() => String)
    name: string;

    @Column() //테이블의 컬럼으로 변환
    @Field(() => Int)
    age: number;
}
