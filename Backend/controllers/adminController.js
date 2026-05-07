const User = require('../models/User');
const MentorRequest = require('../models/MentorRequest');
const Session = require('../models/Session');

const userDto = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  domain: user.domain || user.interests || 'General',
  company: user.company,
  createdAt: user.createdAt,
});

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users: users.map(userDto) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load users' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Active', 'Pending', 'Verified', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid user status' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: userDto(user) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update user status' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [users, mentors, sessions, requests, pendingUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'mentor', status: { $ne: 'Suspended' } }),
      Session.countDocuments(),
      MentorRequest.countDocuments({ status: 'Pending' }),
      User.countDocuments({ status: 'Pending' })
    ]);

    const domains = await User.distinct('domain', { role: 'mentor', status: { $ne: 'Suspended' } });

    res.json({
      stats: {
        users,
        mentors,
        sessions,
        pendingRequests: requests,
        pendingUsers,
        domains: domains.filter(Boolean).length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load admin stats' });
  }
};
