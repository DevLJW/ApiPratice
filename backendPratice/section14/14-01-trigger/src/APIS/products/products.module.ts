import { Module } from '@nestjs/common/decorators';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsSaleslocationsService } from '../productsSaleslocations/productSaleslocations.service';
import { ProductSaleslocation } from '../productsSaleslocations/entities/productSaleslocation.entity';
import { ProductsTagsService } from '../productsTags/productsTags.service';
import { ProductTag } from '../productsTags/entities/productTag.entity';
import { ProductSubscriber } from './entities/product.subscriber';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductSaleslocation, ProductTag]),
    ], //forFeature : Repo 종류들 넣기 이중에 하나를 골라 서비스에서 @InjectRepository(Product) DI하여 사용
    providers: [
        ProductSubscriber,
        ProductsResolver,
        ProductsService,
        ProductsSaleslocationsService,
        ProductsTagsService,
    ],
})
export class ProductsModule {}
