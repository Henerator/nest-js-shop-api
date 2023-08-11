import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './models/review.model';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private model: Model<ReviewDocument>) {}

  async getAll(): Promise<Review[]> {
    return this.model.find().exec();
  }

  async findByProductId(productId: string): Promise<Review[]> {
    return this.model.find({ productId }).exec();
  }

  async create(dto: CreateReviewDto): Promise<Review> {
    return this.model.create(dto);
  }

  async delete(id: string): Promise<Review | null> {
    return this.model.findByIdAndRemove(id).exec();
  }

  async deleteByProductId(productId: string) {
    return this.model.deleteMany({ productId }).exec();
  }
}
