import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { ProductModel } from "./models/product.model";
import { ParseObjectIdPipe } from "src/common/pipes/parse-object-id.pipe";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { Public } from "src/auth";
import { CategoryModel } from "src/categories/models/category.model";
import { ProductCategoryLoader } from "./product-category.loader";

// The resolver should normally call the service. It should not directly call Mongoose:
@Resolver(() => ProductModel)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly productCategoryLoader: ProductCategoryLoader,
  ) { }

  // The catalogue is readable by anyone; only the mutations below need a signed-in caller.
  @Public()
  // Create a GraphQL query named products. It returns an array of ProductModel.
  @Query(() => [ProductModel], { name: "products" })
  products(): Promise<ProductModel[]> {
    return this.productService.findAll()
  }

  @Public()
  // becuase the response is null then we need to add nullable in the GraphQL as well
  @Query(() => ProductModel, { name: "product", nullable: true })
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
  deleteProduct(@Args('id', { type: () => ID }, ParseObjectIdPipe) id: string): Promise<boolean> {
    return this.productService.remove(id)
  }

  @Public()
  @ResolveField(() => CategoryModel, { nullable: true })
  category(@Parent() product: ProductModel): Promise<CategoryModel | null> {
    if (!product.categoryId) return Promise.resolve(null);
    return this.productCategoryLoader.load(product.categoryId);
  }

}
