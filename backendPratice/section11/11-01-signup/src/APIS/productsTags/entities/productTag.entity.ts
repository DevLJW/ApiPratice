import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/APIS/products/entities/product.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'; //typeorm : 변환도구

@Entity() //테이블로 변환하기
@ObjectType()
export class ProductTag {
    @PrimaryGeneratedColumn('uuid') //기본키로 변환된다.
    @Field(() => String) //graphql 타입 데이터형식 반환용
    id: string;
    @Column() //테이블의 컬럼으로 변환
    @Field(() => String) //graphql 타입 데이터형식 반환용
    name: string;

    @ManyToMany(() => Product, (products) => products.productTags)
    @Field(() => [Product]) //반환타입
    products: Product[];
}
