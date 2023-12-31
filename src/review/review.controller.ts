import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEmail } from 'src/decorators/user-email.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './errors.const';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@UserEmail() email: string) {
    console.log('[LOG] ', email);
    return this.service.getAll();
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string) {
    return this.service.findByProductId(productId);
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deleted = await this.service.delete(id);
    if (!deleted) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('byProduct/:productId')
  async deleteByProduct(
    @Param('productId', IdValidationPipe) productId: string,
  ) {
    const deleted = await this.service.deleteByProductId(productId);
    return deleted.deletedCount;
  }
}
