const mongoose = require('mongoose');
const User = require('../models/User');
const { mentorDto } = require('../utils/formatters');

const mentorQuery = () => ({ role: 'mentor', status: { $ne: 'Suspended' } });

exports.getMentors = async (req, res) => {
  try {
    const { domain, q } = req.query;
    const filter = mentorQuery();

    if (domain && domain !== 'All Domains') {
      filter.domain = domain;
    }

    if (q) {
      const search = new RegExp(q, 'i');
      filter.$or = [
        { name: search },
        { company: search },
        { jobRole: search },
        { domain: search },
        { skills: search },
        { bio: search }
      ];
    }

    const mentors = await User.find(filter).select('-password').sort({ match: -1, rating: -1 });
    res.json({ mentors: mentors.map(mentorDto) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load mentors' });
  }
};

exports.getMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = mentorQuery();

    if (mongoose.Types.ObjectId.isValid(id)) {
      filter.$or = [{ _id: id }, { slug: id }];
    } else {
      filter.slug = id;
    }

    const mentor = await User.findOne(filter).select('-password');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json({ mentor: mentorDto(mentor) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load mentor profile' });
  }
};

exports.addResource = async (req, res) => {
  try {
    const title = req.body.title?.trim();
    if (!title) {
      return res.status(400).json({ message: 'Resource title is required' });
    }

    const mentor = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { resources: title } },
      { returnDocument: 'after' }
    ).select('-password');

    res.status(201).json({ resources: mentor.resources });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add resource' });
  }
};
