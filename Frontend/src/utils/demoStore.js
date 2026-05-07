const CURRENT_USER_KEY = 'mcplus_current_user';
const TOKEN_KEY = 'mcplus_token';
const SESSIONS_KEY = 'mcplus_sessions';
const REQUESTS_KEY = 'mcplus_requests';

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getCurrentUser = () =>
  readJson(CURRENT_USER_KEY, {
    id: 'student-demo',
    name: 'Demo Student',
    email: 'student@mentorconnect.test',
    role: 'student',
    branch: 'CSE',
    year: '3',
    domain: 'Web Development',
    interests: 'React, internships, placement preparation',
    goal: 'Build a portfolio and get internship guidance',
  });

export const getStoredUser = () => readJson(CURRENT_USER_KEY, null);

export const setCurrentUser = (user) => {
  writeJson(CURRENT_USER_KEY, user);
};

export const setAuthSession = ({ token, user }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) setCurrentUser(user);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const getSessions = () => readJson(SESSIONS_KEY, []);

export const saveSession = (session) => {
  const sessions = getSessions();
  const nextSessions = [session, ...sessions];
  writeJson(SESSIONS_KEY, nextSessions);
  return nextSessions;
};

export const getRequests = () => readJson(REQUESTS_KEY, []);

export const saveRequest = (request) => {
  const requests = getRequests();
  const alreadyExists = requests.some(
    (item) => item.mentorId === request.mentorId && item.studentId === request.studentId,
  );

  if (alreadyExists) {
    return requests;
  }

  const nextRequests = [request, ...requests];
  writeJson(REQUESTS_KEY, nextRequests);
  return nextRequests;
};

export const createUser = (formData) => {
  const timestamp = Date.now();
  const role = formData.role || 'student';

  return {
    id: `${role}-${timestamp}`,
    name: formData.name || (role === 'mentor' ? 'Demo Mentor' : 'Demo Student'),
    email: formData.email || `${role}@mentorconnect.test`,
    role,
    branch: formData.branch || 'CSE',
    year: formData.year || '3',
    domain: formData.domain || formData.interests || 'Web Development',
    interests: formData.interests || formData.skills || 'Career guidance',
    goal: formData.goal || formData.jobRole || 'Find the right mentoring path',
    company: formData.company || 'Mentor Connect Network',
    title: formData.jobRole || 'Mentor',
  };
};
