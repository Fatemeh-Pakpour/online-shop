import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';

import { CategoryService } from '../categories/category.service';
import { CategoryModel } from '../categories/models/category.model';

@Injectable({ scope: Scope.REQUEST })
export class ProductCategoryLoader {
  private readonly loader = new DataLoader<string, CategoryModel | null>(async (categoryIds) => {
    const categories = await this.categoryService.findManyByIds(categoryIds);
    const categoriesById = new Map(categories.map((category) => [category.id, category]));

    return categoryIds.map((categoryId) => categoriesById.get(categoryId) ?? null);
  });

  constructor(private readonly categoryService: CategoryService) {}

  load(categoryId: string): Promise<CategoryModel | null> {
    return this.loader.load(categoryId);
  }
}
