import { CreateProductInput } from '../dto/create-product.input';

export interface IProductServiceCreate {
    createProductInput: CreateProductInput;
}

export interface IProductServiceFindOne {
    productId: string;
}
