import { Field, Float, ID, ObjectType } from "@nestjs/graphql";

import { CategoryModel } from "../../categories/models/category.model";

// Graphql output model not the validation model
// Use this TypeScript class as a GraphQL response/output type.

// we cannot use zod here
// // Data returned to the client
// Your class defines all fields that clients are allowed to query,not the fields required in every response.
// The object type defines what is available, while the resolver defines how the data is retrieved.
// Data returned from GraphQL

// frontend fragment on Product matches the backend schema type.
@ObjectType('Product')
export class ProductModel {
    @Field(() => ID)
    id!: string

    @Field()
    name!: string

    @Field(() => Float)
    price!: number

    @Field(() => ID, { nullable: true })
    categoryId?: string | null

    @Field(() => CategoryModel, { nullable: true })
    category?: CategoryModel | null

    @Field()
    createdAt!: Date

    @Field()
    updatedAt!: Date
}
