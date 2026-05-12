const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ODRequest = require('../models/ODRequest');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/users/faculty
// @desc    Get all faculty and their availability
router.get('/faculty', auth, async (req, res) => {
  try {
    const faculty = await User.find({ role: { $in: ['Faculty', 'HOD'] } }).select('-password');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/availability
// @desc    Update own availability
router.put('/availability', auth, async (req, res) => {
  try {
    const { availability } = req.body; // 'Available', 'Busy', 'Absent'
    
    if (!['Faculty', 'HOD'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only faculty can update availability' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.availability = availability;
    await user.save();

    res.json({ message: 'Availability updated', availability: user.availability });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/me
// @desc    Get current logged in user details
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/profile/stats
// @desc    Get OD request statistics for the logged-in user
router.get('/profile/stats', auth, async (req, res) => {
  try {
    const { role, userId } = req.user;
    let stats = {};

    if (role === 'Student') {
      const total = await ODRequest.countDocuments({ studentId: userId });
      const approved = await ODRequest.countDocuments({ studentId: userId, status: 'Approved' });
      const rejected = await ODRequest.countDocuments({ studentId: userId, status: 'Rejected' });
      stats = { total, approved, rejected };
    } else if (role === 'Faculty') {
      const pendingReview = await ODRequest.countDocuments({ currentApprover: 'Advisor' });
      const totalReviewed = await ODRequest.countDocuments({ 'approvalWorkflow.advisor.approvedBy': userId });
      const approvedByMe = await ODRequest.countDocuments({ 
        'approvalWorkflow.advisor.approvedBy': userId,
        'approvalWorkflow.advisor.status': 'Approved'
      });
      const rejectedByMe = await ODRequest.countDocuments({ 
        'approvalWorkflow.advisor.approvedBy': userId,
        'approvalWorkflow.advisor.status': 'Rejected'
      });
      stats = { pendingReview, totalReviewed, approvedByMe, rejectedByMe };
    } else if (role === 'HOD') {
      const pendingReview = await ODRequest.countDocuments({ currentApprover: 'HOD' });
      const totalReviewed = await ODRequest.countDocuments({ 'approvalWorkflow.hod.approvedBy': userId });
      const approvedByMe = await ODRequest.countDocuments({ 
        'approvalWorkflow.hod.approvedBy': userId,
        'approvalWorkflow.hod.status': 'Approved'
      });
      const rejectedByMe = await ODRequest.countDocuments({ 
        'approvalWorkflow.hod.approvedBy': userId,
        'approvalWorkflow.hod.status': 'Rejected'
      });
      stats = { pendingReview, totalReviewed, approvedByMe, rejectedByMe };
    } else if (role === 'Admin') {
      const totalStudents = await User.countDocuments({ role: 'Student' });
      const totalFaculty = await User.countDocuments({ role: 'Faculty' });
      const totalHOD = await User.countDocuments({ role: 'HOD' });
      const totalRequests = await ODRequest.countDocuments({});
      
      const approvedRequests = await ODRequest.countDocuments({ status: 'Approved' });
      const pendingRequests = await ODRequest.countDocuments({ status: 'Pending' });
      const rejectedRequests = await ODRequest.countDocuments({ status: 'Rejected' });

      const departments = await User.distinct('department');
      const totalDepartments = departments.filter(d => d).length;

      // Faculty by Department
      const facultyByDeptRaw = await User.aggregate([
        { $match: { role: { $in: ['Faculty', 'HOD'] }, department: { $ne: null, $ne: '' } } },
        { $group: { _id: "$department", count: { $sum: 1 } } }
      ]);
      const facultyByDept = facultyByDeptRaw.map(d => ({ name: d._id, value: d.count }));

      // Department Requests
      const deptRequestsRaw = await ODRequest.aggregate([
        { $match: { department: { $ne: null, $ne: '' } } },
        { $group: { _id: "$department", count: { $sum: 1 } } }
      ]);
      const departmentRequests = deptRequestsRaw.map(d => ({ name: d._id, value: d.count }));

      // Monthly Trend
      const monthlyTrendRaw = await ODRequest.aggregate([
        { 
          $group: { 
            _id: { $month: "$createdAt" }, 
            count: { $sum: 1 } 
          } 
        },
        { $sort: { "_id": 1 } }
      ]);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyTrend = monthlyTrendRaw.map(m => ({
        name: monthNames[m._id - 1],
        Requests: m.count
      }));

      stats = { 
        totalStudents, totalFaculty, totalHOD, totalRequests,
        approvedRequests, pendingRequests, rejectedRequests,
        totalDepartments,
        facultyByDept, departmentRequests, monthlyTrend
      };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/add
// @desc    Add a new user (Faculty/HOD) - Admin only
router.post('/add', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Admin can add users' });
    }
    const { name, email, password, role, department } = req.body;
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role, department });
    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: { _id: newUser._id, name, role, department } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/all
// @desc    Get all users - Admin only
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Admin can view all users' });
    }
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
