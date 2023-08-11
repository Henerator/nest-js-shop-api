import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TopLevelCategory } from '../models/top-level-category.enum';

export class FindTopPageDto {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;

  @IsOptional()
  @IsNumber()
  limit: number;
}
