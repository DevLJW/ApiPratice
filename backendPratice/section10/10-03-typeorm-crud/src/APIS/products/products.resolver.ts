import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create-product.input';
import { Product } from './entities/product.entity';
import { IProductServiceFindOne } from './interfaces/products-service.interface';

@Resolver()
export class ProductsResolver {
    //
    constructor(private readonly productsService: ProductsService) {}

    @Query(() => [Product])
    fetchProducts(): Promise<Product[]> {
        return this.productsService.findAll(); //여기 return 앞부분에서 동기식이 걸림
    } //전체상품조회

    @Query(() => Product) //쿼리일때는 Input Type 데이터 X
    fetchProduct(@Args('productId') productId: string): Promise<Product> {
        return this.productsService.findOne({ productId });
    } //상품하나조회

    @Mutation(() => Product) //graphql용 반환타입(반환할려는 데이터가 Graphql 타입이라서 )
    createProduct(
        @Args('createProductInput') createProductInput: CreateProductInput,
    ): Promise<Product> {
        //사용자에게 데이터를 받는곳(사용자에게받을변수명)(받은데이터를 담아서 사용할 변수명)
        return this.productsService.create({ createProductInput }); //브라우저에 던져주기
    }
}
