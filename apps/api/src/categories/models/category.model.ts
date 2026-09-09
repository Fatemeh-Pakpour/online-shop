import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Category')
export class CategoryModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
