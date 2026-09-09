import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateCategoryInput } from './dto/create-category.input';
import { CategoryModel } from './models/category.model';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

  async findAll(): Promise<CategoryModel[]> {
    const categories = await this.categoryModel.find().sort({ name: 1 }).exec();
    return categories.map((category) => this.toModel(category));
  }

  async findOne(id: string): Promise<CategoryModel | null> {
    const category = await this.categoryModel.findById(id).exec();
    return category ? this.toModel(category) : null;
  }

  async findManyByIds(ids: readonly string[]): Promise<CategoryModel[]> {
    const objectIds = ids
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (objectIds.length === 0) return [];

    const categories = await this.categoryModel.find({ _id: { $in: objectIds } }).exec();
    return categories.map((category) => this.toModel(category));
  }

  async create(input: CreateCategoryInput): Promise<CategoryModel> {
    const category = await this.categoryModel.create({ name: input.name });
    return this.toModel(category);
  }

  async assertExists(id: string): Promise<void> {
    const exists = await this.categoryModel.exists({ _id: id }).exec();
    if (!exists) {
      throw new NotFoundException(`Category with id "${id}" was not found.`);
    }
  }

  private toModel(category: CategoryDocument): CategoryModel {
    return {
      id: category._id.toString(),
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
