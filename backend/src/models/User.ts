import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  creditsBalance: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    creditsBalance: {
      type: Number,
      default: 100, // Les regalamos 100 créditos iniciales de prueba
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema);