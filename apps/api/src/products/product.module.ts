import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
  // imports means: “bring features/services from another module into this module.”
  // Mongoose product model/database access
  // Without the MongooseModule.forFeature(...) import, Nest would not know how to inject productModel.
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  // classes Nest should create and manage with dependency injection.
  providers: [ProductResolver, ProductService],
})
export class ProductModule { }
