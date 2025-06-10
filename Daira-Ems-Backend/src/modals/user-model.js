import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    a_id: {
      type: String,
      require: false,
    },
    city: {
      type: String,
    },
    file: {
      type: String,
      required: false,
    },
    approved: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
