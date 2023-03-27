import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;

  @Prop(
    raw({
      meta1: { type: String },
      meta2: { type: String },
    }),
  )
  _meta?: Record<string, any>;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
