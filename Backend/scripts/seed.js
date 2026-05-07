const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const MentorRequest = require('../models/MentorRequest');
const Session = require('../models/Session');
const { mentors } = require('../data/seedData');

dotenv.config();

const seed = async () => {
  await connectDB();

  const password = await bcrypt.hash('mentor123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const mentorSlugs = mentors.map((mentor) => mentor.slug);

  await User.deleteMany({ role: 'mentor', slug: { $nin: mentorSlugs } });
  await MentorRequest.deleteMany({});
  await Session.deleteMany({});

  for (const mentor of mentors) {
    await User.findOneAndUpdate(
      { email: mentor.email },
      {
        ...mentor,
        graduationYear: 2020,
        password
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }

  const student = await User.findOneAndUpdate(
    { email: 'student@mentorconnect.test' },
    {
      slug: 'demo-student',
      name: 'Demo Student',
      email: 'student@mentorconnect.test',
      password: studentPassword,
      role: 'student',
      status: 'Active',
      branch: 'CSE',
      year: '3',
      domain: 'Web Development',
      interests: 'React, internships, placement preparation',
      goal: 'Build a portfolio and get internship guidance'
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  await User.findOneAndUpdate(
    { email: 'admin@mentorconnect.test' },
    {
      slug: 'admin',
      name: 'Admin User',
      email: 'admin@mentorconnect.test',
      password: adminPassword,
      role: 'admin',
      status: 'Active',
      domain: 'Platform Administration'
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  const aravindraj = await User.findOne({ slug: 'g-aravindraj' });
  const kalaivani = await User.findOne({ slug: 't-kalaivani' });

  await MentorRequest.findOneAndUpdate(
    { mentor: aravindraj._id, student: student._id },
    {
      mentor: aravindraj._id,
      student: student._id,
      requestedFor: 'Today 7:00 PM',
      goal: 'Prepare for AWS and DevOps certification labs',
      branch: 'CSE',
      status: 'Pending'
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  await Session.findOneAndUpdate(
    { mentor: kalaivani._id, student: student._id, topic: 'AI mini project planning' },
    {
      mentor: kalaivani._id,
      student: student._id,
      topic: 'AI mini project planning',
      date: new Date().toISOString().slice(0, 10),
      time: 'Friday 3:30 PM',
      mode: 'Google Meet',
      notes: 'Discuss dataset selection and project scope.',
      status: 'Confirmed'
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  console.log('Seed completed');
  console.log('Student: student@mentorconnect.test / student123');
  console.log('Mentor: aravindraj@mentorconnect.test / mentor123');
  console.log('Admin: admin@mentorconnect.test / admin123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
