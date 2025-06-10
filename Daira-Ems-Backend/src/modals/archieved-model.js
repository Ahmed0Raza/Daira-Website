import mongoose from 'mongoose';

const ArchivedRegistrationSchema = new mongoose.Schema(
  {
    originalId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: String, required: true },
    teamId: { type: String, required: true },
    approved: { type: Boolean, default: false },
    payable: { type: Number, required: true },
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ArchivedTeamSchema = new mongoose.Schema(
  {
    originalId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    participants: [String],
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ArchivedRegistration = mongoose.model(
  'ArchivedRegistration',
  ArchivedRegistrationSchema
);
const ArchivedTeam = mongoose.model('ArchivedTeam', ArchivedTeamSchema);
export default { ArchivedTeam, ArchivedRegistration };
