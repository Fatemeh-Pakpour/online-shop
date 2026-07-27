import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';

import { Task } from './schemas/task.schema';
import { TasksService } from './tasks.service';

const id = new Types.ObjectId();
const now = new Date();

const doc = {
  _id: id,
  title: 'Write docs',
  completed: false,
  createdAt: now,
  updatedAt: now,
  save: jest.fn(),
};

const modelMock = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
};

const exec = <T>(value: T) => ({ exec: () => Promise.resolve(value) });

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [TasksService, { provide: getModelToken(Task.name), useValue: modelMock }],
    }).compile();
    service = moduleRef.get(TasksService);
  });

  it('maps documents to the GraphQL model without mongoose internals', async () => {
    modelMock.find.mockReturnValue({ sort: () => exec([doc]) });

    await expect(service.findAll()).resolves.toEqual([
      { id: id.toString(), title: 'Write docs', completed: false, createdAt: now, updatedAt: now },
    ]);
  });

  it('returns null when a task does not exist', async () => {
    modelMock.findById.mockReturnValue(exec(null));

    await expect(service.findOne(id.toString())).resolves.toBeNull();
  });

  it('throws NotFoundException when updating a missing task', async () => {
    modelMock.findByIdAndUpdate.mockReturnValue(exec(null));

    await expect(service.update(id.toString(), { title: 'new' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('flips the completed flag when toggling', async () => {
    const target = { ...doc, completed: false, save: jest.fn().mockResolvedValue(undefined) };
    modelMock.findById.mockReturnValue(exec(target));

    const result = await service.toggle(id.toString());

    expect(result.completed).toBe(true);
    expect(target.save).toHaveBeenCalledTimes(1);
  });

  it('reports whether a delete removed a document', async () => {
    modelMock.findByIdAndDelete.mockReturnValue(exec(null));
    await expect(service.remove(id.toString())).resolves.toBe(false);

    modelMock.findByIdAndDelete.mockReturnValue(exec(doc));
    await expect(service.remove(id.toString())).resolves.toBe(true);
  });
});
