import mongoose from 'mongoose';

const societySchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  society: {
    type: String,
    required: true,
  },
});

const society = mongoose.model('Society', societySchema);

export default society;
