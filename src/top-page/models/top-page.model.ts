import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Advantage, AdvantageSchema } from './advantage.interface';
import { HhData, HhDataSchema } from './hh-data.interface';
import { TopLevelCategory } from './top-level-category.enum';

@Schema({ timestamps: true })
export class TopPage {
  @Prop({ enum: TopLevelCategory, type: Number })
  firstCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop({ type: [HhDataSchema] })
  hh?: HhData;

  @Prop({ type: [AdvantageSchema] })
  advantages: Advantage;

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop([String])
  tags: string[];
}

export type TopPageDocument = HydratedDocument<TopPage>;

export const TopPageSchema = SchemaFactory.createForClass(TopPage);
