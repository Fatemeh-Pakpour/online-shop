import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

//  // Data received from the client
// This class represents data that a GraphQL client can send to the server.
@InputType()
export class CreateProductInput {
  @Field()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'name must not be empty' })
  @Length(1, 200)
  name!: string;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;
}
