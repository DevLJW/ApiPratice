import { Module } from '@nestjs/common/decorators';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsSaleslocationsService } from '../productsSaleslocations/productSaleslocations.service';
import { ProductSaleslocation } from '../productsSaleslocations/entities/productSaleslocation.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, ProductSaleslocation])], //forFeature : Repo 종류들 넣기 이중에 하나를 골라 서비스에서 @InjectRepository(Product) DI하여 사용
    providers: [
        ProductsResolver,
        ProductsService,
        ProductsSaleslocationsService,
    ],
})
export class ProductsModule {}
