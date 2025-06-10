import mongoose from 'mongoose';

const ambassadorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    institute: {
      type: String,
      required: true,
    },
    campusName: {
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
      required: true,
      unique: true,
    },
    image: {
      data: {
        type: mongoose.Schema.Types.Buffer,
        required: [true, 'Image data is required'],
      },
      contentType: {
        type: String,
        required: [true, 'Image content type is required'],
      },
    },
  },
  { timestamps: true }
);

const Ambassador = mongoose.model('Ambassador', ambassadorSchema);

export default Ambassador;
