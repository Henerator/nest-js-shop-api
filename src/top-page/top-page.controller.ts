import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUND } from './errors.const';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly service: TopPageService) {}

  @Get()
  async get() {
    return this.service.getAll();
  }

  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    const topPage = await this.service.findById(id);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
    return topPage;
  }

  @Get('by-alias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const topPage = await this.service.findByAlias(alias);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
    return topPage;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async findByCategory(@Body() dto: FindTopPageDto) {
    return this.service.findByCategory(dto.firstCategory);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deleted = await this.service.delete(id);
    if (!deleted) {
      throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updated = await this.service.updateById(id, dto);
    if (!updated) {
      throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Get('search/:text')
  async search(@Param('text') text: string) {
    return await this.service.findByText(text);
  }
}
