import mongoose from 'mongoose';

const ambassadorNominationschema = new mongoose.Schema(
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
    typeOfInstitute: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    studentAffairOfficerName: {
      type: String,
      required: true,
    },
    studentAffairOfficerContact: {
      type: Number,
      required: true,
    },
    attendedDairaBefore: {
      type: Boolean,
      required: true,
    },
    ambassadorDaira: {
      type: Boolean,
      required: true,
    },
    previousExperience: {
      type: String,
      required: true,
    },
    plansOfDaira: {
      type: String,
      required: true,
    },
    participantsNumber: {
      type: Number,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const AmbassadorNomination = mongoose.model(
  'AmbassadorNomination',
  ambassadorNominationschema
);

export default AmbassadorNomination;
