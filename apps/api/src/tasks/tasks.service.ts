import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { TaskModel } from './models/task.model';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) {}

  async findAll(): Promise<TaskModel[]> {
    const tasks = await this.taskModel.find().sort({ createdAt: -1 }).exec();
    return tasks.map((task) => this.toModel(task));
  }

  async findOne(id: string): Promise<TaskModel | null> {
    const task = await this.taskModel.findById(id).exec();
    return task ? this.toModel(task) : null;
  }

  async create(input: CreateTaskInput): Promise<TaskModel> {
    const task = await this.taskModel.create({
      title: input.title,
      completed: input.completed ?? false,
    });
    return this.toModel(task);
  }

  async update(id: string, input: UpdateTaskInput): Promise<TaskModel> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true })
      .exec();
    return this.toModel(this.assertFound(task, id));
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async toggle(id: string): Promise<TaskModel> {
    const task = await this.taskModel.findById(id).exec();
    const found = this.assertFound(task, id);
    found.completed = !found.completed;
    await found.save();
    return this.toModel(found);
  }

  private assertFound(task: TaskDocument | null, id: string): TaskDocument {
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" was not found.`);
    }
    return task;
  }

  /** Maps a Mongoose document to the GraphQL model so persistence details never leak. */
  private toModel(task: TaskDocument): TaskModel {
    return {
      id: task._id.toString(),
      title: task.title,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
