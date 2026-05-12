const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    const existingAdmin = await User.findOne({ email: 'admin@smartduty.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      name: 'System Admin',
      email: 'admin@smartduty.com',
      password: hashedPassword,
      role: 'Admin',
      department: 'Administration'
    });
    
    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@smartduty.com');
    console.log('Password: admin123');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
