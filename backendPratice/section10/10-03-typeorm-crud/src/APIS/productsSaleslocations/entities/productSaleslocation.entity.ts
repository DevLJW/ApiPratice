import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'; //typeorm : 변환도구

@Entity() //테이블로 변환하기
@ObjectType()
export class ProductSaleslocation {
    @PrimaryGeneratedColumn('uuid') //기본키로 변환된다.
    @Field(() => String)
    id: string;
    @Column() //테이블의 컬럼으로 변환
    @Field(() => String)
    address: string;
    @Column() //테이블의 컬럼으로 변환
    @Field(() => String)
    addressDetail: string;
    @Column({ type: 'decimal', precision: 9, scale: 6 }) //테이블의 컬럼으로 변환
    @Field(() => Float)
    lat: string;
    @Column({ type: 'decimal', precision: 9, scale: 6 }) //테이블의 컬럼으로 변환
    @Field(() => Float)
    lng: string;
    @Column() //테이블의 컬럼으로 변환
    @Field(() => Date)
    meetingTime: Date;
}
