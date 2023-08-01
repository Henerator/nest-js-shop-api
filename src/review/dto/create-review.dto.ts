import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Min(1, { message: 'You should not send me rating less than 1' })
  @Max(5)
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}
