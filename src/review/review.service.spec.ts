import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReviewService } from './review.service';
import { Review } from './models/review.model';
import { Types } from 'mongoose';

describe('ReviewService', () => {
  let service: ReviewService;

  const findResult = {
    exec: jest.fn(),
  };

  const reviewRepositoryFactory = () => ({
    find: () => findResult,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getModelToken(Review.name),
          useFactory: reviewRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find product by id', async () => {
    const id = new Types.ObjectId(1).toHexString();
    reviewRepositoryFactory()
      .find()
      .exec.mockReturnValueOnce([{ productId: id }]);

    const response = await service.findByProductId(id);
    expect(response[0].productId).toEqual(id);
  });
});
