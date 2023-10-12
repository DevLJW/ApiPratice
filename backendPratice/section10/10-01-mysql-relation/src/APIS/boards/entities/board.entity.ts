import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Int, Field } from '@nestjs/graphql';
@Entity() //  Board가 엔티티함수로 들어가 테이블로 만들어짐
@ObjectType() //그래프큐엘 명세서에 타입선언을 하기위한 데코레이터
export class Board {
    @PrimaryGeneratedColumn('increment') //유니크한 프라이머리키 만들기 increment는 1씩 증가하는 값 uuid는 유니크한 아이디
    @Field(() => Int) //Graphql 명세서용 타입
    number: number;
    @Column() //컬럼으로 만들기
    @Field(() => String)
    writer: string;
    @Column() //컬럼으로 만들기
    @Field(() => String)
    title: string;
    @Column() //컬럼으로 만들기
    @Field(() => String)
    contents: string;
}
