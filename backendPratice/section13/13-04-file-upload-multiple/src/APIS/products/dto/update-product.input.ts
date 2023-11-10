import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';

@InputType()
// 파셜타입 상속받은 타입이 ?로 붙은 상태로 받을 수 있다.
export class UpdateProductInput extends PartialType(CreateProductInput) {
    // 아래 내용들을 상속 받는다.
    // name?: string;
    // description?: string;
    // price?: number;
}
