import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    participants: [String],
  },
  { timestamps: true }
);

const Team = mongoose.model('Team', TeamSchema);

export default Team;
