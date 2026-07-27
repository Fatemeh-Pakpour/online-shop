import { Field, ID, ObjectType } from '@nestjs/graphql';

/** GraphQL representation of a task — decoupled from the Mongoose document. */
@ObjectType('Task')
export class TaskModel {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  completed!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
