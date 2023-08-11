import { IsString } from 'class-validator';

export class AdvantageDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
