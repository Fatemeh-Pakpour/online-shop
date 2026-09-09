import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Public } from 'src/auth';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { CategoryModel } from './models/category.model';

@Resolver(() => CategoryModel)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Query(() => [CategoryModel], { name: 'categories' })
  categories(): Promise<CategoryModel[]> {
    return this.categoryService.findAll();
  }

  @Public()
  @Query(() => CategoryModel, { name: 'category', nullable: true })
  category(@Args('id', { type: () => ID }, ParseObjectIdPipe) id: string): Promise<CategoryModel | null> {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => CategoryModel)
  createCategory(@Args('input') input: CreateCategoryInput): Promise<CategoryModel> {
    return this.categoryService.create(input);
  }
}
