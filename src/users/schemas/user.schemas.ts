import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatar: String,
});

export interface User extends Document {
  name: string;
  email: string;
  avatar?: string;
}
