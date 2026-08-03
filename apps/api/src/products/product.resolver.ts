import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { ProductModel } from "./models/product.model";
import { ParseObjectIdPipe } from "src/common/pipes/parse-object-id.pipe";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";

// The resolver should normally call the service. It should not directly call Mongoose:
@Resolver(() => ProductModel)
export class ProductResolver {
  constructor(private readonly productService: ProductService) { }

  // Create a GraphQL query named products. It returns an array of ProductModel.
  @Query(() => [ProductModel], { name: "products" })
  products(): Promise<ProductModel[]> {
    return this.productService.findAll()
  }

  @Query(() => ProductModel, { name: "product" })
  product(@Args('id', { type: () => ID }, ParseObjectIdPipe) id: string): Promise<ProductModel | null> {
    return this.productService.findOne(id)
  }
  @Mutation(() => ProductModel)
  // this @Args('input') input is the  GraphQL argument name
  //  input: CreateProductInput,  local TypeScript variable

  createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<ProductModel> {
    return this.productService.create(input)
  }

  @Mutation(() => ProductModel)
  updateProduct(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
    @Args('input') input: UpdateProductInput
  ): Promise<ProductModel> {
    return this.productService.update(id, input)
  }

  @Mutation(() => Boolean)
  removeProduct(@Args('id', { type: () => ID }, ParseObjectIdPipe) id: string): Promise<boolean> {
    return this.productService.remove(id)
  }

}