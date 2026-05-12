const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Student', 'Faculty', 'HOD', 'Admin'], 
    required: true 
  },
  department: { type: String },
  // Faculty specific
  availability: { 
    type: String, 
    enum: ['Available', 'Busy', 'Absent'], 
    default: 'Available' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
