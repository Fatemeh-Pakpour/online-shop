import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductModel } from './models/product.model';
import { Product, ProductDocument } from './schema/product.schema';

// It should not contain GraphQL decorators such as @Query() and @Mutation().

@Injectable()
export class ProductService {
    constructor(
        //in the product.module we have a import that is imported MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]) 
        // that is telling When someone asks for @InjectModel(Product.name) them the Mongoose model created from ProductSchema.
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) { }

    async findAll(): Promise<ProductModel[]> {
        const products = await this.productModel.find().sort({ createdAt: -1 }).exec();
        return products.map((product) => this.toModel(product));
    }

    async findOne(id: string): Promise<ProductModel | null> {
        const product = await this.productModel.findById(id).exec();
        return product ? this.toModel(product) : null;
    }

    async create(input: CreateProductInput): Promise<ProductModel> {
        const product = await this.productModel.create({
            name: input.name,
            price: input.price,
        });
        return this.toModel(product);
    }

    async update(id: string, input: UpdateProductInput): Promise<ProductModel> {
        if (Object.keys(input).length === 0) {
            throw new BadRequestException('At least one product field must be provided.');
        }

        const product = await this.productModel
            .findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true })
            .exec();
        return this.toModel(this.assertFound(product, id));
    }

    async remove(id: string): Promise<boolean> {
        // At this point, Mongoose creates a Query object. The database operation has not necessarily been sent to MongoDB yet.
        // {
        //   operation: 'findOneAndDelete',
        //   filter: {
        //     _id: id,
        //   },
        //   model: Product,
        // }
        // exec() executes the Mongoose query and returns a real JavaScript Promise.
        // I can use deleteOne becuase I want to return boolean
        const product = await this.productModel.findByIdAndDelete(id).exec();
        this.assertFound(product, id)
        return true
    }

    private assertFound(product: ProductDocument | null, id: string): ProductDocument {
        if (!product) {
            throw new NotFoundException(`Product with id "${id}" was not found.`);
        }
        return product;
    }

    /** Maps a Mongoose document to the GraphQL model so persistence details never leak. */
    private toModel(product: ProductDocument): ProductModel {
        return {
            id: product._id.toString(),
            name: product.name,
            price: product.price,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}
