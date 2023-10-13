import {
    Injectable,
    HttpException,
    HttpStatus,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
    IProductServiceCreate,
    IProductServiceFindOne,
    IProductServiceUpdate,
    IProductsServiceCheckSoldout,
} from './interfaces/products-service.interface';
import { UpdateProductInput } from './dto/update-product.input';
import { Mutation } from '@nestjs/graphql';

@Injectable() //의존성 주입을 할수있게 만들어준다.(싱글톤패턴)
export class ProductsService {
    //
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
    ) {}

    findAll(): Promise<Product[]> {
        return this.productsRepository.find();
    }
    findOne({ productId }: IProductServiceFindOne): Promise<Product> {
        return this.productsRepository.findOne({ where: { id: productId } });
    }

    async create({
        createProductInput,
    }: IProductServiceCreate): Promise<Product> {
        const result = await this.productsRepository.save({
            ...createProductInput,
        });

        return result;
    }

    //  수정

    async update({
        productId,
        updateProductInput,
    }: IProductServiceUpdate): Promise<Product> {
        const product = await this.findOne({
            //기존에 있는 로직을 재사용하여, 로직을 통일하자!
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

            ...product, //  수정 후, 수정되지 않은 다른 결과값까지 모두 객체로 돌려 받고 싶을때
            ...updateProductInput, // 데이터가 있는 중복값만 바꾼다.
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
}
