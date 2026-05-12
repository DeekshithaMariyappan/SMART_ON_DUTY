const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { 
    type: String, 
    enum: ['StatusUpdate', 'NewRequest', 'Comment'], 
    required: true 
  },
  relatedRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'ODRequest' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
