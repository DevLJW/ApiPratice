import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { Product } from '../entities/product.entity';

export interface IProductServiceCreate {
    createProductInput: CreateProductInput;
}

export interface IProductServiceFindOne {
    productId: string;
}

export interface IProductServiceUpdate {
    productId;
    updateProductInput: UpdateProductInput;
}

export interface IProductsServiceCheckSoldout {
    product: Product;
}
