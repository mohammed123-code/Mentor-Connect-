const toSkillList = (skills) => {
  if (Array.isArray(skills)) return skills;
  if (!skills) return [];
  return skills.split(',').map((skill) => skill.trim()).filter(Boolean);
};

const mentorDto = (mentor) => ({
  id: mentor.slug || mentor._id.toString(),
  mongoId: mentor._id,
  slug: mentor.slug,
  name: mentor.name,
  email: mentor.email,
  type: mentor.type,
  title: mentor.jobRole || 'Mentor',
  organization: mentor.company || 'Mentor Connect Network',
  department: mentor.department || mentor.domain,
  domain: mentor.domain || 'Web Development',
  skills: toSkillList(mentor.skills),
  experience: mentor.experience || '3+ years',
  rating: mentor.rating,
  reviews: mentor.reviews,
  sessions: mentor.sessionsDelivered,
  students: mentor.studentsGuided,
  match: mentor.match,
  nextSlot: mentor.nextSlot || mentor.availability?.[0] || 'Next available slot',
  image: mentor.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=640&q=80',
  bio: mentor.bio || `${mentor.name} can guide students in ${mentor.domain || 'career mentoring'}.`,
  achievements: mentor.achievements || [],
  roadmap: mentor.roadmap || [],
  resources: mentor.resources || [],
  availability: mentor.availability || [],
  feedback: mentor.feedback || [],
  status: mentor.status,
});

const requestDto = (request) => ({
  id: request._id,
  mentorId: request.mentor?.slug || request.mentor?._id,
  mentorName: request.mentor?.name || 'Mentor',
  studentId: request.student?._id,
  student: request.student?.name || 'Student',
  studentEmail: request.student?.email,
  branch: request.branch || request.student?.branch || 'Not provided',
  goal: request.goal,
  requestedFor: request.requestedFor,
  status: request.status,
  createdAt: request.createdAt,
});

const sessionDto = (session) => ({
  id: session._id,
  mentorId: session.mentor?.slug || session.mentor?._id,
  mentorName: session.mentor?.name || 'Mentor',
  mentorImage: session.mentor?.image,
  studentId: session.student?._id,
  studentName: session.student?.name || 'Student',
  topic: session.topic,
  date: session.date,
  time: session.time,
  mode: session.mode,
  notes: session.notes,
  status: session.status,
  createdAt: session.createdAt,
});

module.exports = { mentorDto, requestDto, sessionDto, toSkillList };
