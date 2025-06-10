import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    cnic: {
      type: String,
      required: true,
      unique: false,
    },
    contactNumber: {
      type: String,
      required: false,
      unique: false,
    },
    userId: {
      type: String,
      required: true,
    },
    team: {
      type: [String],
      required: false,
    },
    gender: {
      type: String,
      required: true,
    },
    accommodation: {
      type: Boolean,
      default: false,
    },
    accommodation_status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Participant = mongoose.model('Participant', ParticipantSchema);

export default Participant;
