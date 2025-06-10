import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    teamId: {
      type: String,
      required: true,
      unique: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    payable: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model('Registration', RegistrationSchema);

export default Registration;
