import { Field, Float, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

// Every field is optional — clients send only what they want to change.
@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 200)
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;
}
