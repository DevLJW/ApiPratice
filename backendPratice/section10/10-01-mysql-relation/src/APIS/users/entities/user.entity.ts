import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'; //typeorm : 변환도구

@Entity() //테이블로 변환하기
export class User {
    @PrimaryGeneratedColumn('uuid') //기본키로 변환된다.
    id: string;
    @Column() //테이블의 컬럼으로 변환
    name: string;
    @Column() //테이블의 컬럼으로 변환
    email: string;
}
