const mongoose = require('mongoose');

const ODRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  reason: { type: String, required: true },
  eventDetails: { type: String, required: true },
  documents: { type: String }, // Optional link/path to uploaded document
  posterUrl: { type: String, required: true }, 
  paymentProofUrl: { type: String, required: true },
  qrCode: { type: String }, // Generated base64 QR code once approved
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  currentApprover: { 
    type: String, 
    enum: ['Advisor', 'HOD', 'Completed'], 
    default: 'Advisor' 
  },
  approvalWorkflow: {
    advisor: {
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date }
    },
    hod: {
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date }
    }
  },
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ODRequest', ODRequestSchema);
