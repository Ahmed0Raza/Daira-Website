import mongoose from 'mongoose';

const accommodationSchema = new mongoose.Schema({
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

const accommodations_team = mongoose.model(
  'Accommodation-Team',
  accommodationSchema
);

export default accommodations_team;
