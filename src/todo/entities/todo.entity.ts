import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Todo extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  title: string;

  @Prop({
    index: true,
  })
  description: string;

  @Prop({
    default: false,
  })
  completed: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);