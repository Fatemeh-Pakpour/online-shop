import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { TaskModel } from './models/task.model';
import { TasksService } from './tasks.service';

@Resolver(() => TaskModel)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Query(() => [TaskModel], { name: 'tasks' })
  tasks(): Promise<TaskModel[]> {
    return this.tasksService.findAll();
  }

  @Query(() => TaskModel, { name: 'task', nullable: true })
  task(@Args('id', { type: () => ID }, ParseObjectIdPipe) id: string): Promise<TaskModel | null> {
    return this.tasksService.findOne(id);
  }

  @Mutation(() => TaskModel)
  createTask(@Args('input') input: CreateTaskInput): Promise<TaskModel> {
    return this.tasksService.create(input);
  }

  @Mutation(() => TaskModel)
  updateTask(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
    @Args('input') input: UpdateTaskInput,
  ): Promise<TaskModel> {
    return this.tasksService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteTask(@Args('id', { type: () => ID }, ParseObjectIdPipe) id: string): Promise<boolean> {
    return this.tasksService.remove(id);
  }

  @Mutation(() => TaskModel)
  toggleTask(@Args('id', { type: () => ID }, ParseObjectIdPipe) id: string): Promise<TaskModel> {
    return this.tasksService.toggle(id);
  }
}
