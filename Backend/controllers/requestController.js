const User = require('../models/User');
const MentorRequest = require('../models/MentorRequest');
const mongoose = require('mongoose');
const { requestDto } = require('../utils/formatters');

const populateRequest = (query) =>
  query.populate('mentor', 'name slug image company jobRole domain')
    .populate('student', 'name email branch year goal');

exports.getRequests = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'student') {
      filter.student = req.user._id;
    } else if (req.user.role === 'mentor') {
      filter.mentor = req.user._id;
    }

    const requests = await populateRequest(MentorRequest.find(filter).sort({ createdAt: -1 }));
    res.json({ requests: requests.map(requestDto) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load requests' });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { mentorId, requestedFor, goal } = req.body;

    const mentorFilter = { role: 'mentor' };
    if (mongoose.Types.ObjectId.isValid(mentorId)) {
      mentorFilter.$or = [{ _id: mentorId }, { slug: mentorId }];
    } else {
      mentorFilter.slug = mentorId;
    }

    const mentor = await User.findOne(mentorFilter);

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const request = await MentorRequest.findOneAndUpdate(
      { mentor: mentor._id, student: req.user._id },
      {
        mentor: mentor._id,
        student: req.user._id,
        requestedFor: requestedFor || mentor.nextSlot || mentor.availability?.[0] || 'Next available slot',
        goal: goal || req.user.goal || 'Mentorship guidance',
        branch: req.user.branch,
        status: 'Pending'
      },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );

    const populated = await populateRequest(MentorRequest.findById(request._id));
    res.status(201).json({ request: requestDto(populated) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to send request' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid request status' });
    }

    const filter = { _id: req.params.id };
    if (req.user.role === 'mentor') {
      filter.mentor = req.user._id;
    }

    const request = await populateRequest(
      MentorRequest.findOneAndUpdate(filter, { status }, { returnDocument: 'after' })
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ request: requestDto(request) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update request' });
  }
};
