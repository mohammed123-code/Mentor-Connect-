import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { branches, domains } from '../data/mockData';
import { registerUser } from '../api';
import { setAuthSession } from '../utils/demoStore';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    branch: '',
    year: '',
    domain: 'Web Development',
    interests: '',
    goal: '',
    graduationYear: '',
    company: '',
    jobRole: '',
    skills: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await registerUser(formData);
      setAuthSession(response.data);
      navigate(response.data.user.role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="container">
          <div className="register-shell">
            <section className="auth-copy compact-copy">
              <span className="eyebrow">Join the network</span>
              <h1>Create a complete mentoring profile</h1>
              <p>
                Student profiles capture interests and goals. Mentor profiles capture expertise,
                availability, and career background for better recommendations.
              </p>
            </section>

            <section className="auth-card wide-card" aria-label="Registration form">
              <h2>Create Account</h2>
              <p>Your profile will be saved in MongoDB and used across the dashboards.</p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="segmented-control mb-4">
                  <label className={formData.role === 'student' ? 'active' : ''}>
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={formData.role === 'student'}
                      onChange={handleChange}
                    />
                    <span>Student</span>
                  </label>
                  <label className={formData.role === 'mentor' ? 'active' : ''}>
                    <input
                      type="radio"
                      name="role"
                      value="mentor"
                      checked={formData.role === 'mentor'}
                      onChange={handleChange}
                    />
                    <span>Mentor / Alumni</span>
                  </label>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="name">
                      Full name
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="email">
                      Email address
                    </label>
                    <input
                      className="form-control"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      className="form-control"
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm password
                    </label>
                    <input
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {formData.role === 'student' ? (
                  <>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="branch">
                          Branch
                        </label>
                        <select
                          className="form-select"
                          id="branch"
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select branch</option>
                          {branches.map((branch) => (
                            <option key={branch} value={branch}>
                              {branch}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="year">
                          Year
                        </label>
                        <select
                          className="form-select"
                          id="year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select year</option>
                          <option value="1">1st year</option>
                          <option value="2">2nd year</option>
                          <option value="3">3rd year</option>
                          <option value="4">4th year</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="domain">
                          Domain
                        </label>
                        <select
                          className="form-select"
                          id="domain"
                          name="domain"
                          value={formData.domain}
                          onChange={handleChange}
                        >
                          {domains
                            .filter((domain) => domain !== 'All Domains')
                            .map((domain) => (
                              <option key={domain} value={domain}>
                                {domain}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="interests">
                        Skills and interests
                      </label>
                      <input
                        className="form-control"
                        id="interests"
                        name="interests"
                        type="text"
                        value={formData.interests}
                        onChange={handleChange}
                        placeholder="React, Python, UI design, internships"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="goal">
                        Guidance goal
                      </label>
                      <textarea
                        className="form-control"
                        id="goal"
                        name="goal"
                        rows="3"
                        value={formData.goal}
                        onChange={handleChange}
                        placeholder="Describe what kind of mentorship you need"
                      ></textarea>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="graduationYear">
                          Graduation year
                        </label>
                        <input
                          className="form-control"
                          id="graduationYear"
                          name="graduationYear"
                          type="number"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="company">
                          Company
                        </label>
                        <input
                          className="form-control"
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="jobRole">
                          Job role
                        </label>
                        <input
                          className="form-control"
                          id="jobRole"
                          name="jobRole"
                          type="text"
                          value={formData.jobRole}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="skills">
                        Skills and expertise
                      </label>
                      <input
                        className="form-control"
                        id="skills"
                        name="skills"
                        type="text"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="AI/ML, placements, cloud, research"
                      />
                    </div>
                  </>
                )}

                <button className="btn btn-primary btn-lg w-100 mt-3" type="submit">
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
                <p className="auth-switch">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Register;
