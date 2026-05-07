const User = require('../models/User');
const Session = require('../models/Session');
const mongoose = require('mongoose');
const { sessionDto } = require('../utils/formatters');

const populateSession = (query) =>
  query.populate('mentor', 'name slug image company jobRole domain')
    .populate('student', 'name email branch year');

exports.getSessions = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'student') {
      filter.student = req.user._id;
    } else if (req.user.role === 'mentor') {
      filter.mentor = req.user._id;
    }

    const sessions = await populateSession(Session.find(filter).sort({ createdAt: -1 }));
    res.json({ sessions: sessions.map(sessionDto) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load sessions' });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { mentorId, topic, date, time, mode, notes } = req.body;

    if (!topic || !date || !time) {
      return res.status(400).json({ message: 'Topic, date, and time are required' });
    }

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

    const session = await Session.create({
      mentor: mentor._id,
      student: req.user._id,
      topic,
      date,
      time,
      mode,
      notes
    });

    await User.findByIdAndUpdate(mentor._id, { $inc: { sessionsDelivered: 1 } });

    const populated = await populateSession(Session.findById(session._id));
    res.status(201).json({ session: sessionDto(populated) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to book session' });
  }
};
