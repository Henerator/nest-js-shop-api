import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ id: false })
export class HhData {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;
}

export const HhDataSchema = SchemaFactory.createForClass(HhData);
