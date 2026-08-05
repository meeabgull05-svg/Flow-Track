import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  fullName?: string;
  email: string;
  password?: string;
  accountType?: string;
  orgName?: string;
  orgType?: string;
  orgCode?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    accountType: {
      type: String,
      default: 'Individual',
    },
    orgName: {
      type: String,
      trim: true,
    },
    orgType: {
      type: String,
      trim: true,
    },
    orgCode: {
      type: String,
      trim: true,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
