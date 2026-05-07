import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { loginUser } from '../api';
import { setAuthSession } from '../utils/demoStore';

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'admin', label: 'Admin' },
];

const dashboardPath = {
  student: '/student-dashboard',
  mentor: '/mentor-dashboard',
  admin: '/admin-dashboard',
};

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Enter an email and password to continue.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await loginUser(formData);
      setAuthSession(response.data);
      navigate(dashboardPath[response.data.user.role]);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Check your email, password, and role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="container">
          <div className="auth-shell">
            <section className="auth-copy">
              <span className="eyebrow">Welcome back</span>
              <h1>Continue your mentorship journey</h1>
              <p>
                Access mentor recommendations, session bookings, resources, requests, and admin
                controls from one frontend experience.
              </p>
              <div className="auth-points">
                <span>Smart mentor matching</span>
                <span>Session and request tracking</span>
                <span>Role-based dashboards</span>
              </div>
            </section>

            <section className="auth-card" aria-label="Login form">
              <h2>Login</h2>
              <p>Use your registered account, or try the seeded demo accounts after MongoDB is seeded.</p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="segmented-control mb-4">
                  {roleOptions.map((role) => (
                    <label className={formData.role === role.value ? 'active' : ''} key={role.value}>
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleChange}
                      />
                      <span>{role.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email address
                  </label>
                  <input
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@college.edu"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="form-control form-control-lg"
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </div>

                <div className="form-options">
                  <label className="form-check-label">
                    <input className="form-check-input me-2" type="checkbox" />
                    Remember me
                  </label>
                  <Link to="/register">Create account</Link>
                </div>

                <button className="btn btn-primary btn-lg w-100 mt-4" type="submit">
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;
