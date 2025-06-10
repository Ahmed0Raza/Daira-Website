import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    invoiceId: {
      type: String,
      required: true,
      unique: true, // Unique constraint for invoiceId
    },
    registrationId: [
      {
        type: String,
        required: true,
      },
    ],
    amountPayable: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    participantId: [
      {
        type: String,
        required: true,
      },
    ],
    agentId: {
      type: String,
      required: true,
    },
    log: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Create an index on invoiceId to enforce uniqueness at the database level
InvoiceSchema.index({ invoiceId: 1 }, { unique: true });

const Invoice = mongoose.model('Invoice', InvoiceSchema);

export default Invoice;
