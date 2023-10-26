import { Injectable } from '@nestjs/common/decorators/core';
import { In, Repository } from 'typeorm';
import { ProductTag } from './entities/productTag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
    IProductsTagsServiceBulkInsert,
    IProductsTagsServiceFindByNames,
} from './interfaces/products-tags-service.interfaces';

@Injectable()
export class ProductsTagsService {
    constructor(
        @InjectRepository(ProductTag)
        private readonly productsTagsRepository: Repository<ProductTag>,
    ) {}

    async findByNames({ tagNames }: IProductsTagsServiceFindByNames) {
        return await this.productsTagsRepository.find({
            where: { name: In(tagNames) }, //중복된값을 찾아와 반환이됨
        });
    }

    async bulkInsert({ names }: IProductsTagsServiceBulkInsert) {
        return await this.productsTagsRepository.insert(names); //insert는 배열이 들어갈 수 있다.  save는 배열이 X
    }
}
