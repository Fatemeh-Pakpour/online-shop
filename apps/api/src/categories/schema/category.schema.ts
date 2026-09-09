import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'categories',
  timestamps: true,
  versionKey: false,
})
export class Category {
  @Prop({ required: true, trim: true, minlength: 1, maxlength: 120, unique: true })
  name!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);
