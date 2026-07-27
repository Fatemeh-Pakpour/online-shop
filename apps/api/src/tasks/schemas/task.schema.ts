import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'tasks' })
export class Task {
  @Prop({ required: true, trim: true, minlength: 1, maxlength: 200 })
  title!: string;

  @Prop({ required: true, default: false })
  completed!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export type TaskDocument = HydratedDocument<Task>;

export const TaskSchema = SchemaFactory.createForClass(Task);
