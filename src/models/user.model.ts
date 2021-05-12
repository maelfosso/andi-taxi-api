import mongoose, { Schema, Types } from 'mongoose';

interface UserAttributes {
  name: string;
  phoneNumber: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttributes): UserDocument;
}

interface UserDocument extends mongoose.Document {
  name: string;
  phoneNumber: string;
  createdAt: Date;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: [
      (v:string) => {
        return /^\+\d{1,}$/.test(v)
      },
      '{PATH} must be a valid phone number (+xxxxxxxx)'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

UserSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
}

const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export { User, UserDocument, UserAttributes };
