import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ id: false })
export class Advantage {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

export const AdvantageSchema = SchemaFactory.createForClass(Advantage);
