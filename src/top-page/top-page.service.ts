import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopLevelCategory } from './models/top-level-category.enum';
import { TopPage, TopPageDocument } from './models/top-page.model';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPage.name) private model: Model<TopPageDocument>,
  ) {}

  async getAll(): Promise<TopPage[]> {
    return this.model.find().exec();
  }

  async findById(id: string) {
    return this.model.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return this.model.findOne({ alias }).exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.model
      .aggregate()
      .match({ firstCategory })
      .group({
        _id: { secondCategory: '$secondCategory' },
        pages: { $push: { alias: '$alias', title: '$title' } },
      })
      .exec();
  }

  async findByText(text: string) {
    return this.model
      .find({
        $text: {
          $search: text,
          $caseSensitive: false,
        },
      })
      .exec();
  }

  async create(dto: CreateTopPageDto): Promise<TopPage> {
    return this.model.create(dto);
  }

  async delete(id: string): Promise<TopPage | null> {
    return this.model.findByIdAndRemove(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto): Promise<TopPage | null> {
    return this.model.findByIdAndUpdate(id, dto, { new: true });
  }
}
