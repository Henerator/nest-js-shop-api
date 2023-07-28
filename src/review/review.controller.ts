import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './errors.const';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async get() {
    return this.reviewService.getAll();
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId') productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.reviewService.delete(id);
    if (!deleted) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('byProduct/:productId')
  async deleteByProduct(@Param('productId') productId: string) {
    const deleted = await this.reviewService.deleteByProductId(productId);
    return deleted.deletedCount;
  }
}
