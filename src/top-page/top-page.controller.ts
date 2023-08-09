import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPage } from './models/top-page.model';

@Controller('top-page')
export class TopPageController {
  @Post('create')
  async create(@Body() dto: Omit<TopPage, '_id'>) {}

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {}

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {}

  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: TopPage,
  ) {}

  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindTopPageDto) {}
}
