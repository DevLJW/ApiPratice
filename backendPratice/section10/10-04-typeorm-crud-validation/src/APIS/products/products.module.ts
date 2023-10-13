import { Module } from '@nestjs/common/decorators';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product])], //forFeature : Repo 종류들 넣기 이중에 하나를 골라 서비스에서 @InjectRepository(Product) DI하여 사용
    providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
