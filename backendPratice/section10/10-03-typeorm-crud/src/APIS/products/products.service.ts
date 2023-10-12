import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
    IProductServiceCreate,
    IProductServiceFindOne,
} from './interfaces/products-service.interface';

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
}
