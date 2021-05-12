import mongoose, { Schema } from 'mongoose';

interface UserCodeAttributes {
  code: string;
  phoneNumber: string;
}

interface UserCodeModel extends mongoose.Model<UserCodeDocument> {
  build(attrs: UserCodeAttributes): UserCodeDocument;
}

interface UserCodeDocument extends mongoose.Document {
  code: string;
  phoneNumber: string;
  createdAt: Date;
}

const UserCodeSchema = new Schema({
  code: {
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

UserCodeSchema.statics.build = (attrs: UserCodeAttributes) => {
  return new UserCode(attrs);
}

const UserCode = mongoose.model<UserCodeDocument, UserCodeModel>('UserCode', UserCodeSchema);

export { UserCode, UserCodeDocument, UserCodeAttributes };
