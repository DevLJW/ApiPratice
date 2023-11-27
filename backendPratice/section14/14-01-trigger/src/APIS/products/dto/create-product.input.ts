import { Int, PartialType } from '@nestjs/graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql/dist/decorators';
import { DeepPartial } from 'typeorm';
import { IsEmpty, IsString, Length, Min } from 'class-validator';
import { ProductSaleslocationInput } from 'src/APIS/productsSaleslocations/entities/dto/product-saleslocation.input';
import { ProductTag } from 'src/APIS/productsTags/entities/productTag.entity';
import { Product } from '../entities/product.entity';

//  타입스크립트에서 작성한 코드를 Grapql형식으로 변환을 해야하기때문에
//  데코레이션을 작성한다.
//  @InputType,@Field() 그래프큐엘 타입으로 변환을 해줘야 그래프큐엘에서 사용이 가능하다.
@InputType()
export class CreateProductInput {
    @Field(() => String)
    name: string;
    @Field(() => String)
    description: string;
    @Min(0)
    @Field(() => Int)
    price: number;

    @Field(() => ProductSaleslocationInput)
    productSaleslocation: ProductSaleslocationInput;

    @Field(() => String)
    productCategoryId: string;

    @Field(() => [String])
    productTags: DeepPartial<string[]>;
}
