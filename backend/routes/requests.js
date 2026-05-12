const express = require('express');
const router = express.Router();
const ODRequest = require('../models/ODRequest');
const Notification = require('../models/Notification');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const QRCode = require('qrcode');

// @route   POST /api/requests
// @desc    Create an OD Request (Student)
router.post('/', auth, upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'paymentProof', maxCount: 1 }, { name: 'document', maxCount: 1 }]), async (req, res) => {
  try {
    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can apply for OD' });
    }

    if (!req.files || !req.files['poster'] || !req.files['paymentProof']) {
      return res.status(400).json({ message: 'Both Event Poster and Proof of Payment are required.' });
    }

    const { department, reason, eventDetails, startDate, endDate } = req.body;
    const posterUrl = `/uploads/${req.files['poster'][0].filename}`;
    const paymentProofUrl = `/uploads/${req.files['paymentProof'][0].filename}`;
    
    let documentsUrl = req.body.documents || '';
    if (req.files && req.files['document']) {
      documentsUrl = `/uploads/${req.files['document'][0].filename}`;
    }
    
    const newRequest = new ODRequest({
      studentId: req.user.userId,
      department,
      reason,
      eventDetails,
      documents: documentsUrl,
      posterUrl,
      paymentProofUrl,
      startDate,
      endDate,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('OD REQUEST CREATION ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/requests
// @desc    Get requests based on user role
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    const { role, userId } = req.user;

    if (role === 'Student') {
      query.studentId = userId;
    } else if (role === 'Faculty') {
      // Assuming Faculty acts as Advisor for now. Could filter by department
      query.currentApprover = 'Advisor';
    } else if (role === 'HOD') {
      query.currentApprover = 'HOD';
    }

    const requests = await ODRequest.find(query).populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/requests/:id/approve
// @desc    Approve or Reject an OD Request
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const request = await ODRequest.findById(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    const { role, userId } = req.user;
    
    if (status === 'Rejected') {
      request.status = 'Rejected';
      request.currentApprover = 'Completed';
      // Store who rejected it
      if (role === 'Faculty') request.approvalWorkflow.advisor = { status: 'Rejected', approvedBy: userId, date: new Date() };
      if (role === 'HOD') request.approvalWorkflow.hod = { status: 'Rejected', approvedBy: userId, date: new Date() };
    } else if (status === 'Approved') {
      if (role === 'Faculty' && request.currentApprover === 'Advisor') {
        request.approvalWorkflow.advisor = { status: 'Approved', approvedBy: userId, date: new Date() };
        request.currentApprover = 'HOD';
      } else if (role === 'HOD' && request.currentApprover === 'HOD') {
        request.approvalWorkflow.hod = { status: 'Approved', approvedBy: userId, date: new Date() };
        request.currentApprover = 'Completed';
        request.status = 'Approved';
        
        // Generate QR Code containing the verify URL
        try {
          const verifyUrl = `http://localhost:5173/verify/${request._id}`;
          request.qrCode = await QRCode.toDataURL(verifyUrl);
        } catch (err) {
          console.error("Failed to generate QR Code", err);
        }
      } else {
        return res.status(403).json({ message: 'Not authorized to approve at this stage' });
      }
    }

    const updatedRequest = await request.save();
    
    // Create Notification for Student
    await new Notification({
      userId: updatedRequest.studentId,
      message: `Your OD request status was updated to ${status} by ${role}`,
      type: 'StatusUpdate',
      relatedRequest: updatedRequest._id
    }).save();

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/requests/:id/comment
// @desc    Add a comment to the request
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const request = await ODRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.comments.push({ userId: req.user.userId, text });
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/requests/verify/:id
// @desc    Public endpoint to verify an OD request's validity
router.get('/verify/:id', async (req, res) => {
  try {
    const request = await ODRequest.findById(req.params.id).populate('studentId', 'name email department');
    
    if (!request) {
      return res.status(404).json({ valid: false, message: 'OD Request not found' });
    }
    
    if (request.status !== 'Approved') {
      return res.status(400).json({ valid: false, message: 'OD Request is not fully approved yet' });
    }

    res.json({
      valid: true,
      studentName: request.studentId.name,
      studentEmail: request.studentId.email,
      department: request.department,
      reason: request.reason,
      eventDetails: request.eventDetails,
      startDate: request.startDate,
      endDate: request.endDate,
      approvedDate: request.approvalWorkflow?.hod?.date || request.updatedAt
    });
  } catch (error) {
    res.status(500).json({ valid: false, message: 'Invalid ID format or server error', error: error.message });
  }
});

module.exports = router;
