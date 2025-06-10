import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: false,
    },
    otpExpiry: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('otp')) return next();

  this.otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  next();
});
userSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.model('Userforgetpass', userSchema);

export default User;
