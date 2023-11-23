import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'; //typeorm : 변환도구
import { ProductSaleslocation } from '../../productsSaleslocations/entities/productSaleslocation.entity';
import { ProductCategory } from '../../productsCategories/entities/productCategory.entity';
import { User } from '../../users/entities/user.entity';
import { ProductTag } from '../../productsTags/entities/productTag.entity';
import { Field, Int, ObjectType, PartialType } from '@nestjs/graphql';

@Entity() //테이블로 변환하기
@ObjectType() //graphql 객체 타입으로 반환(사용자와 상호작용하기 위해)
export class Product {
    @PrimaryGeneratedColumn('uuid') //기본키로 변환된다.
    @Field(() => String) //graphql 타입 데이터형식 반환용
    id: string;
    @Column() //테이블의 컬럼으로 변환
    @Field(() => String) //graphql 타입 데이터형식 반환용
    name: string;
    @Column()
    @Field(() => String) //graphql 타입 데이터형식 반환용
    description: string;
    @Column()
    @Field(() => Int) //graphql 타입 데이터형식 반환용
    price: number;
    @Column({ default: false }) //기본값으로 줄시 tinyint(1) 0과 1값으로 들어간다.
    @Field(() => Boolean) //graphql 타입 데이터형식 반환용
    isSoldout: boolean;

    //DB 조인
    @JoinColumn() // 1:1관계에서는 중심테이블을 잡아야하므로 JoinColumn을 작성 해준다.(외래키 컬럼이 하나 더생성된다.)
    @OneToOne(() => ProductSaleslocation) //   1:1관계 연결
    @Field(() => ProductSaleslocation) //반환타입
    productSaleslocation: ProductSaleslocation; //외래키

    @ManyToOne(() => ProductCategory) //   다:일 관계
    @Field(() => ProductCategory) //반환타입
    productCategory: ProductCategory; //외래키

    @ManyToOne(() => User)
    @Field(() => User) //반환타입
    user: User;

    @JoinTable() // 다대다는 둘중에 한곳에 JoinTable을 작성한다.(중간테이블생성)
    @ManyToMany(() => ProductTag, (ProductTags) => ProductTags.products) //  ManyToMany에서는 반대편에서 나를가르키는 테이블을 작성해준다.
    @Field(() => [ProductTag]) //반환타입
    productTags: ProductTag[];

    @DeleteDateColumn() //  소프트삭제 시간 기록을 위함
    deletedAt: Date;

    // @CreateDateColumn() //  데이터 추가시 추가시간 자동 추가
    // createdAt: Date;

    // @UpdateDateColumn() //  데이터 수정시 수정 시간 자동으로 추가
    // updateAt: Date;
}
