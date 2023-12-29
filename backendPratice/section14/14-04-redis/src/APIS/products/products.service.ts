import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
    IProductServiceCreate,
    IProductServiceFindOne,
    IProductServiceUpdate,
    IProductsServiceCheckSoldout,
} from './interfaces/products-service.interface';
import { ProductsSaleslocationsService } from '../productsSaleslocations/productSaleslocations.service';

import { ProductsTagsService } from '../productsTags/productsTags.service';

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
            ProductSaleslocation: result, //result 통쨰로 넣기(앞에서 저장한 주소데이터 주소외래키값 포함)
            ProductCategory: {
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

        const result = this.productsRepository.save({
            //save는 디비에 저장하고 결과값을 받아온다.(create,insert는 등록하고 결과값을 안가져옴)
            //find, save 등을 사용하시게 되면 등록/조회된 객체를 반환
            //insert를 사용하게 되면 generatedMaps, identifiers 등의 결과를 반환받게 됩니다!
            /*  같은 객체 키가 있을때에는 중복된 키값은 후에 작성된 키로 대체된다.
                updateProduct같은경우 ?로 타입이 선언되어있어 값이 있는경우에는, updateProductInput 값으로 대체되고,
                없는경우(빈값(수정을안함))경우, 그전에있는 product값으로 적용된다.
            id: productId,
            isSoldout: product.isSoldout,
            name: product.name,
            description: product.description,
            price: product.price,
            name: updateProductInput.name,
            description: updateProductInput.description,
            price: product.price,
            */

            //  수정 후, 수정되지 않은 다른 결과값까지 모두 객체로 돌려 받고 싶을때()
            ...product,
            updateProductInput,
        });

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
