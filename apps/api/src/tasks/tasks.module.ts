import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Task, TaskSchema } from './schemas/task.schema';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
