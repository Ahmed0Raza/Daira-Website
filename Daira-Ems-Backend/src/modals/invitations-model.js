import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const invitations_team = mongoose.model('Invitation-Team', invitationSchema);

export default invitations_team;
