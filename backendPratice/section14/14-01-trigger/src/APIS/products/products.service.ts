import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { In, Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
    IProductServiceCreate,
    IProductServiceFindOne,
    IProductServiceUpdate,
    IProductsServiceCheckSoldout,
} from './interfaces/products-service.interface';
import { ProductsSaleslocationsService } from '../productsSaleslocations/productSaleslocations.service';
import { ProductTag } from '../productsTags/entities/productTag.entity';
import { ProductsTagsService } from '../productsTags/productsTags.service';
import { ProductSaleslocation } from '../productsSaleslocations/entities/productSaleslocation.entity';

interface IProductServiceDelete {
    productId: string;
}

//서비스(비즈니스 로직)

@Injectable() //의존성 주입을 할수있게 만들어준다.(싱글톤패턴)
export class ProductsService {
    //
    constructor(
        @InjectRepository(Product) //  DB 접근같은경우, 자동으로 생성자 주입이 안되어서 Repo같은경우 @Inject를 붙혀줘야함
        private readonly productsRepository: Repository<Product>,
        @InjectRepository(ProductSaleslocation) //  DB 접근같은경우, 자동으로 생성자 주입이 안되어서 Repo같은경우 @Inject를 붙혀줘야함
        private readonly productSalesLocationRepository: Repository<ProductSaleslocation>,
        private readonly productsSaleslocationsService: ProductsSaleslocationsService,
        private readonly productsTagsService: ProductsTagsService,
    ) {}

    findAll(): Promise<Product[]> {
        return this.productsRepository.find({
            relations: ['productSaleslocation', 'productCategory'], //조인하여 가져오기
        });
    }
    findOne({ productId }: IProductServiceFindOne): Promise<Product> {
        return this.productsRepository.findOne({
            where: { id: productId },
            relations: ['productSaleslocation', 'productCategory'],
        }); //조인하여 가져오기
    }

    async create({
        createProductInput,
    }: IProductServiceCreate): Promise<Product> {
        // 1. 상품 하나만 등록할 때 사용하는 방법
        // const result = await this.productsRepository.save({
        //     ...createProductInput,
        // });
        // return result;
        //  2. 상품과 상품거래위치를 같이 등록하는 방법

        const {
            productSaleslocation,
            productCategoryId,
            productTags,
            ...product
        } = createProductInput; /// ...product 안에는 productSaleslocation 이외에 값들이 복사되어 있다.

        //  2-1  상품거래위치 등록
        const result = await this.productsSaleslocationsService.create({
            productSaleslocation,
        }); // 위치저장 테이블에 데이터 저장하기

        //  2-2 상품태그 등록

        const tagNames = productTags.map((el) => el.replace('#', '')); //   ["전자제품", "영등포","컴퓨터"]
        const prevTags = await this.productsTagsService.findByNames({
            //  [{id:"전자제품ID",name:"전자제품"}]
            tagNames,
        });

        const temp = [];
        tagNames.forEach((el) => {
            const isExists = prevTags.find((prevel) => el === prevel.name); //같은 데이터 뽑기
            if (!isExists)
                //  같은 값이 없다면,
                temp.push({ name: el }); //[{키:값},{키:값}]형태로 푸쉬[{}]
        });

        const newTags = await this.productsTagsService.bulkInsert({
            names: temp,
        });
        const tags = [...prevTags, ...newTags.identifiers]; // 태그합치기

        const result2 = await this.productsRepository.save({
            //상품테이블에 상품정보 저장

            ...product,
            //상품 테이블 주소위치 외래키값으로 위치정보 테이블의 기본키값 저장(조인용)
            productSaleslocation: result, //result 통쨰로 넣기(앞에서 저장한 주소데이터 주소외래키값 포함)
            productCategory: {
                id: productCategoryId,
                //  name까지 프론트엔드에서 리턴 받고 싶으면 ?
                //  createProductInput에 name까지 포함해서 받아오기
            },

            productTags: tags,

            //  하나하나 넣는방법
            /*
            name: product.name,
            description: product.description,
            price: product.price,
            productSaleslocation:{
                id: result.id,
            },
            */
        });

        return result2;
    }

    //  수정

    async update({
        productId,
        updateProductInput,
    }: IProductServiceUpdate): Promise<Product> {
        const product = await this.findOne({
            //기존에 있는 로직을 재사용하여, 로직을 통일하자!(해당 게시글번호에 해당하는 정보가져오기)
            productId,
        });

        this.checkSoldout({ product });

        // if (product.isSoldout) {
        //     throw new HttpException(
        //         '이미 판매 완료된 상품 입니다.',
        //         HttpStatus.UNPROCESSABLE_ENTITY,
        //     );
        // }

        const {
            productSaleslocation,
            productCategoryId,
            productTags,
            ...updateproduct
        } = updateProductInput; //  수정할 게시글 정보

        const exist = await this.productsRepository.findOne({
            //수정전 게시글 하나
            where: { id: productId },
            relations: ['productSaleslocation', 'productCategory'],
        });

        //위치등록 이후 반환받기
        const location: ProductSaleslocation =
            await this.productSalesLocationRepository.save({
                id: exist.productSaleslocation.id,
                ...productSaleslocation,
            });

        //태그등록

        const tagNames = productTags.map((el) => el.replace('#', '')); //사용자가 새로 등록한 태그   ["전자제품", "영등포","컴퓨터"]

        //  이전 태그들
        const prevTags = await this.productsTagsService.findByNames({
            //  [{id:"전자제품ID",name:"전자제품"}]
            tagNames,
        });

        const temp = [];
        tagNames.forEach((el) => {
            const isExists = prevTags.find((prevel) => el === prevel.name); //같은 데이터 뽑기
            if (!isExists)
                //  같은 값이 없다면,
                temp.push({ name: el }); //[{키:값},{키:값}]형태로 푸쉬[{}]
        });

        const newTags = await this.productsTagsService.bulkInsert({
            names: temp,
        });
        const tags = [...prevTags, ...newTags.identifiers]; // 태그합치기

        const result1: Product = await this.productsRepository.save({
            ...exist,
            ...updateproduct,
            //상품 테이블 주소위치 외래키값으로 위치정보 테이블의 기본키값 저장(조인용)
            productSaleslocation: location, //result 통쨰로 넣기(앞에서 저장한 주소데이터 주소외래키값 포함)
            productCategory: {
                id: productCategoryId,
                //  name까지 프론트엔드에서 리턴 받고 싶으면 ?
                //  createProductInput에 name까지 포함해서 받아오기
            },

            productTags: tags,
        });
        const result = await this.productsRepository.save(result1);
        console.log('변경전');
        console.log(exist);
        console.log('변경후');
        console.log(result);
        return result;
    }

    //  수정시, 삭제 등 같은 검증 로직을 사용하기위해 함수로 선언
    checkSoldout({ product }: IProductsServiceCheckSoldout): void {
        if (product.isSoldout) {
            throw new UnprocessableEntityException(
                '이미 판매 완료된 상품 입니다.',
            );
        }
    }

    async delete({ productId }: IProductServiceDelete): Promise<boolean> {
        //  1. 실제삭제 하는방법

        //  2. 소프트삭제 - isDeleted(삭제가 되었다고 가정) 직접구현
        // this.productsRepository.update({ id: productId }, { isDeleted: true });

        //  3. 소프트삭제 - deletedAt(값이 비어 있으면 삭제가 안된것. 값이 있으면 삭제된거(날짜데이터)) 직접구현
        //  this.productsRepository.update({id:productId},{deletedAt: new Date()})

        //  4. 소프트삭제 - TypeOrm 제공 기능(SoftRemove)
        //  단점: id로만 삭제 가능
        //  장점: 여러ID 한번에 지우기 가능 .softRemove([{id:qqq},{id:aaa},{id:bbb}])

        // this.productsRepository.softRemove({ id: productId });

        // 5. 소프트삭제 - TypeOrm 제공 기능(SoftDelete)
        //  단점: 여러 Id 한번에 지우기 불가능.
        //  장점: 다른컬럼으로도 삭제가 가능하다. id만 말고도 name,age 등등
        const result = await this.productsRepository.softDelete({
            id: productId,
        });
        return result.affected ? true : false;
    }
}
