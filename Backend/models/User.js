const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Verified', 'Suspended'],
    default: function() { return this.role === 'mentor' ? 'Pending' : 'Active'; }
  },
  // Student-specific fields
  branch: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  year: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  interests: {
    type: String
  },
  domain: {
    type: String,
    default: 'Web Development'
  },
  goal: {
    type: String
  },
  // Mentor-specific fields
  graduationYear: {
    type: Number,
    required: function() { return this.role === 'mentor'; }
  },
  company: {
    type: String,
    required: function() { return this.role === 'mentor'; }
  },
  jobRole: {
    type: String,
    required: function() { return this.role === 'mentor'; }
  },
  skills: {
    type: String
  },
  type: {
    type: String,
    default: 'Alumni Mentor'
  },
  image: {
    type: String
  },
  bio: {
    type: String
  },
  experience: {
    type: String
  },
  rating: {
    type: Number,
    default: 4.7
  },
  reviews: {
    type: Number,
    default: 0
  },
  sessionsDelivered: {
    type: Number,
    default: 0
  },
  studentsGuided: {
    type: Number,
    default: 0
  },
  match: {
    type: Number,
    default: 80
  },
  nextSlot: {
    type: String
  },
  availability: {
    type: [String],
    default: []
  },
  achievements: {
    type: [String],
    default: []
  },
  roadmap: {
    type: [String],
    default: []
  },
  resources: {
    type: [String],
    default: []
  },
  feedback: {
    type: [
      {
        student: String,
        note: String
      }
    ],
    default: []
  }
}, {
  timestamps: true
});

userSchema.pre('validate', function() {
  if (!this.slug && this.name) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const emailPrefix = this.email
      ? this.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : Date.now().toString();

    this.slug = `${baseSlug}-${emailPrefix}`;
  }
});

module.exports = mongoose.model('User', userSchema);
