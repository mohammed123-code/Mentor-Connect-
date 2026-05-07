const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const publicUser = (user) => ({
  id: user._id,
  slug: user.slug,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  branch: user.branch,
  year: user.year,
  domain: user.domain,
  interests: user.interests,
  goal: user.goal,
  graduationYear: user.graduationYear,
  company: user.company,
  title: user.jobRole,
  jobRole: user.jobRole,
  skills: user.skills,
});

const issueToken = (user) =>
  jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// Register User
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      branch,
      year,
      interests,
      domain,
      goal,
      graduationYear,
      company,
      jobRole,
      skills
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    if (!['student', 'mentor'].includes(role)) {
      return res.status(400).json({ message: 'Only student and mentor self-registration is allowed' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object based on role
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      domain,
      goal
    };

    if (role === 'student') {
      userData.branch = branch;
      userData.year = year;
      userData.interests = interests;
      userData.status = 'Active';
    } else if (role === 'mentor') {
      userData.graduationYear = graduationYear;
      userData.company = company;
      userData.jobRole = jobRole;
      userData.skills = skills;
      userData.status = 'Pending';
      userData.type = 'Alumni Mentor';
      userData.bio = `${name} is available for mentoring in ${domain || 'career guidance'}.`;
      userData.availability = ['Tomorrow 6:00 PM', 'Friday 5:00 PM', 'Saturday 10:00 AM'];
      userData.resources = ['Mentor starter checklist'];
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = issueToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: publicUser(user)
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email and role
    const filter = { email: email?.toLowerCase() };
    if (role) filter.role = role;

    const user = await User.findOne(filter);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ message: 'This account is suspended' });
    }

    // Generate JWT token
    const token = issueToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: publicUser(user)
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};
