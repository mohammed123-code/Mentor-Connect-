const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedFor: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  branch: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

mentorRequestSchema.index({ mentor: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('MentorRequest', mentorRequestSchema);
