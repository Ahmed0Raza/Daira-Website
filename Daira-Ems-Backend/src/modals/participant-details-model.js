import mongoose from 'mongoose';

const participantsDetailSchema = new mongoose.Schema(
  {
    participantId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    eventName: {
      type: String,
    },
    contact: {
      type: String,
    },
    ambassadorContact: {
      type: String,
    },
    institute: {
      type: String,
    },
  },
  { timestamps: true }
);

const ParticipantsDetail = mongoose.model(
  'ParticipantsDetail',
  participantsDetailSchema
);

export default ParticipantsDetail;
