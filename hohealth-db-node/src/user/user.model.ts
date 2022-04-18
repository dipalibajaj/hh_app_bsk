import mongoose from 'mongoose';

import crypto_util from 'node-common-utils/dist/crypto';

export interface User {
  _id: string;
  _createdAt: Date;
  _updatedAt: Date;
  _v: number;
  uid: string;
  name: string;
  email: string;
  phone_number: string;
  profile_image: string;
  dob: string;
  gender: string;
}

export const UserSchema = new mongoose.Schema<User>(
  {
    uid: { type: String, required: true, unique: true },
    name: {
      type: String,
      required: true,
      get: crypto_util.decrypt3DES,
      set: crypto_util.encrypt3DES,
    },
    email: {
      type: String,
      required: true,
      get: crypto_util.decrypt3DES,
      set: crypto_util.encrypt3DES,
      unique: true,
    },
    phone_number: {
      type: String,
      trim: true,
      get: crypto_util.decrypt3DES,
      set: crypto_util.encrypt3DES,
    },
    profile_image: { type: String, trim: true },
    dob: {
      type: String,
      trim: true,
      get: crypto_util.decrypt3DES,
      set: crypto_util.encrypt3DES,
    },
    gender: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    },
  },
);

// enable getter on UserSchema while fetching Object, JSON
UserSchema.set('toObject', { getters: true });
UserSchema.set('toJSON', { getters: true });

export const UserModel = mongoose.model<User>('users', UserSchema);
