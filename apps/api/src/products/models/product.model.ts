import { Field, Float, ID, ObjectType } from "@nestjs/graphql";

// Graphql output model not the validation model
// Use this TypeScript class as a GraphQL response/output type.

// we cannot use zod here
// // Data returned to the client
// Your class defines all fields that clients are allowed to query,not the fields required in every response.
// The object type defines what is available, while the resolver defines how the data is retrieved.
// Data returned from GraphQL

@ObjectType('Product')
export class ProductModel {
    @Field(() => ID)
    id!: string

    @Field()
    name!: string

    @Field(() => Float)
    price!: number

    @Field()
    createdAt!: Date

    @Field()
    updatedAt!: Date
}