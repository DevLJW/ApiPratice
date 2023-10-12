import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'; //typeorm : 변환도구
import { ProductSaleslocation } from '../productsSaleslocations/entities/productSaleslocation.entity';
import { ProductCategory } from '../productsCategories/entities/productCategory.entity';
import { User } from '../users/entities/user.entity';
import { ProductTag } from '../productsTags/entities/productTag.entity';

@Entity() //테이블로 변환하기
export class Product {
    @PrimaryGeneratedColumn('uuid') //기본키로 변환된다.
    id: string;
    @Column() //테이블의 컬럼으로 변환
    name: string;
    @Column()
    description: string;
    @Column()
    price: number;
    @Column({ default: false }) //기본값으로 줄시 tinyint(1) 0과 1값으로 들어간다.
    isSoldout: boolean;

    //DB 조인
    @JoinColumn() // 1:1관계에서는 중심테이블을 잡아야하므로 JoinColumn을 작성 해준다.
    @OneToOne(() => ProductSaleslocation) //   1:1관계 연결
    ProductSaleslocation: ProductSaleslocation; //외래키

    @ManyToOne(() => ProductCategory) //   다:일 관계
    ProductCategory: ProductCategory; //외래키

    @ManyToOne(() => User)
    user: User;

    @JoinTable() // 다대다는 둘중에 한곳에 JoinTable을 작성한다.(중간테이블생성)
    @ManyToMany(() => ProductTag, (ProductTags) => ProductTags.products) //  ManyToMany에서는 반대편에서 나를가르키는 테이블을 작성해준다.
    //
    productTags: ProductTag[];
}
