import mongoose, { Schema } from 'mongoose';

interface UserCodeAttributes {
  code: string;
  phoneNumber: string;
  expiredAt: string;
}

interface UserCodeModel extends mongoose.Model<UserCodeDocument> {
  build(attrs: UserCodeAttributes): UserCodeDocument;
}

interface UserCodeDocument extends mongoose.Document {
  code: string;
  phoneNumber: string;
  expiredAt: Date;
  createdAt: Date;
}

const UserCodeSchema = new Schema({
  code: {
    type: String,
    required: true,
    validate: [
      (v:string) => {
        return /^\d{4}$/.test(v)
      },
      '{PATH} must be a valid code of 4 digits (xxxx)'
    ]
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
  expiredAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

UserCodeSchema.statics.build = (attrs: UserCodeAttributes) => {
  return new UserCode(attrs);
}

const UserCode = mongoose.model<UserCodeDocument, UserCodeModel>('UserCode', UserCodeSchema);

export { UserCode, UserCodeDocument, UserCodeAttributes };
