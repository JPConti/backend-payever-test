import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schemas';

@Schema()
export class Avatar extends Document {
  @Prop({ required: true })
  data: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;
}

export interface Avatar extends Document {
  data: string;
  hash: string;
  userId: User;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
