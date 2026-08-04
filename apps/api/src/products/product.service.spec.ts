import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';

import { ProductService } from './product.service';
import { Product } from './schema/product.schema';

// Types is an object exported by Mongoose. It contains helper classes/types from MongoDB/Mongoose.
// That creates a fake MongoDB ObjectId for the test.

const id = new Types.ObjectId();
const now = new Date();

const doc = {
  _id: id,
  name: 'Keyboard',
  price: 49.99,
  createdAt: now,
  updatedAt: now,
};

// mocking the MongoDB/Mongoose model:
const modelMock = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
};

const exec = <T>(value: T) => ({ exec: Promise.resolve(value) })

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      // When ProductService asks for @InjectModel(Product.name), give it modelMock instead of the real MongoDB model.
      providers: [ProductService, { provide: getModelToken(Product.name), useValue: modelMock }],
    }).compile();
    service = moduleRef.get(ProductService);
  });

  it('maps documents to the GraphQL model without mongoose internals', async () => {
    modelMock.find.mockReturnValue({ sort: () => exec([doc]) });

    await expect(service.findAll()).resolves.toEqual([
      { id: id.toString(), name: 'Keyboard', price: 49.99, createdAt: now, updatedAt: now },
    ]);
  });

  it('returns null when a product does not exist', async () => {
    modelMock.findById.mockReturnValue(exec(null));

    await expect(service.findOne(id.toString())).resolves.toBeNull();
  });

  it('persists only the fields the input allows', async () => {
    modelMock.create.mockResolvedValue(doc);

    await service.create({ name: 'Keyboard', price: 49.99 });

    expect(modelMock.create).toHaveBeenCalledWith({ name: 'Keyboard', price: 49.99 });
  });

  it('runs schema validators on update', async () => {
    modelMock.findByIdAndUpdate.mockReturnValue(exec(doc));

    await service.update(id.toString(), { price: 10 });

    expect(modelMock.findByIdAndUpdate).toHaveBeenCalledWith(
      id.toString(),
      { $set: { price: 10 } },
      { new: true, runValidators: true },
    );
  });

  it('rejects update requests without fields', async () => {
    await expect(service.update(id.toString(), {})).rejects.toBeInstanceOf(BadRequestException)
    expect(modelMock.findByIdAndUpdate).not.toHaveBeenCalled()
  });

  it('throws NotFoundException when updating a missing product', async () => {
    modelMock.findByIdAndUpdate.mockReturnValue(exec(null));

    await expect(service.update(id.toString(), { name: 'new' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('reports whether a delete removed a document', async () => {
    modelMock.findByIdAndDelete.mockReturnValue(exec(null));
    await expect(service.remove(id.toString())).resolves.toBe(false);

    modelMock.findByIdAndDelete.mockReturnValue(exec(doc));
    await expect(service.remove(id.toString())).resolves.toBe(true);
  });
});
