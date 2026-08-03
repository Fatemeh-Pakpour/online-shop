import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// This TypeScript class represents a Mongoose schema.
// Mongoose automatically adds: createdAt: Date; updatedAt: Date;
// By default, Mongoose adds a version property: {"__v": 0}

@Schema({
    collection: "products",
    timestamps: true,
    versionKey: false
})
export class Product {
    // Defines individual database fields and validation rules:
    // Without @Prop(), the property is normally not included in the generated Mongoose schema.
    @Prop({ required: true, trim: true, minlength: 1, maxlength: 200 })
    name!: string

    @Prop({ required: true, min: 0 })
    price!: number

    // Declared for TypeScript only — Mongoose populates these via `timestamps: true`.
    createdAt!: Date;
    updatedAt!: Date;
}
// Product fields plus Mongoose document behavior
// Product with .lean() Plain product data without Mongoose document methods
export type ProductDocument = HydratedDocument<Product>;

// Runtime rules for storing and validating those fields
// Creates the real Mongoose Schema object
export const ProductSchema = SchemaFactory.createForClass(Product);
