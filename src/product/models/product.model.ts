import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ProductCharacteristic,
  ProductCharacteristicSchema,
} from './product-characteristic.model';

@Schema({ timestamps: true })
export class Product {
  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice: number;

  @Prop()
  credit: number;

  @Prop()
  calculatedRating: number;

  @Prop()
  description: string;

  @Prop()
  advantages: string;

  @Prop()
  dsiAdvantages: string;

  @Prop([String])
  categories: string[];

  @Prop()
  tags: string[];

  @Prop({ type: [ProductCharacteristicSchema] })
  characteristics: ProductCharacteristic[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
