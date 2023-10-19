import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductSaleslocation } from './entities/productSaleslocation.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ProductsSaleslocationsService {
    constructor(
        @InjectRepository(ProductSaleslocation)
        private readonly productsSaleslocationsRepository: Repository<ProductSaleslocation>,
    ) {}
    async create({ productSaleslocation }) {
        return await this.productsSaleslocationsRepository.save({
            //위치정보테이블에 위치정보데이터 연결
            ...productSaleslocation,
        });
    }
}
