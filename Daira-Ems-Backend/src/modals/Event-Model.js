import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    emailAddress: {
      type: String,
      required: true,
      trim: true,
    },
    societyName: {
      type: String,
      required: true,
      trim: true,
    },
    eventCategory: {
      type: String,
      required: true,
      trim: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rules: {
      type: String,
      required: true,
      trim: true,
    },
    minTeamSize: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    maxTeamSize: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    headName: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    nuEmailAddress: {
      type: String,
      required: true,
      trim: true,
    },
    registrationType: {
      type: String,
      required: true,
      trim: true,
    },
    prizeMoney: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    registrationFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      required: false,
      default: 'active',
      enum: ['active', 'inactive'],
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
