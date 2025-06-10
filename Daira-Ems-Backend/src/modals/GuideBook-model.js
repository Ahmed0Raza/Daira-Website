import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const guideBookSchema = new Schema(
  {
    pdfFile: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true }
);

const GuideBook = mongoose.model('GuideBook', guideBookSchema);

export default GuideBook;
