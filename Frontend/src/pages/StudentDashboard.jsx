import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { discussionPosts, domains, learningRoadmaps, mentors as fallbackMentors } from '../data/mockData';
import { createRequest, getMentors, getSessions } from '../api';
import { getCurrentUser } from '../utils/demoStore';

function StudentDashboard() {
  const user = getCurrentUser();
  const [query, setQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(user.domain || 'All Domains');
  const [mentors, setMentors] = useState(fallbackMentors);
  const [sessions, setSessions] = useState([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMentors(), getSessions()])
      .then(([mentorResponse, sessionResponse]) => {
        setMentors(mentorResponse.data.mentors);
        setSessions(sessionResponse.data.sessions);
      })
      .catch((error) => {
        setError(error.response?.data?.message || 'Unable to load live dashboard data. Please login again if needed.');
      });
  }, []);

  const recommendedMentors = useMemo(() => {
    const search = query.trim().toLowerCase();

    return mentors
      .filter((mentor) => selectedDomain === 'All Domains' || mentor.domain === selectedDomain)
      .filter((mentor) => {
        if (!search) return true;
        return [mentor.name, mentor.domain, mentor.title, mentor.organization, ...mentor.skills]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((a, b) => b.match - a.match);
  }, [mentors, query, selectedDomain]);

  const handleConnect = async (mentor) => {
    try {
      await createRequest({
        mentorId: mentor.id,
        requestedFor: mentor.nextSlot,
        goal: user.goal || `Guidance in ${mentor.domain}`,
      });
      setNotice(`Connection request sent to ${mentor.name}.`);
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to send connection request.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="container">
          <section className="dashboard-hero">
            <div>
              <span className="eyebrow">Student workspace</span>
              <h1>Welcome, {user.name}</h1>
              <p>
                Your dashboard brings mentor recommendations, sessions, skill roadmaps, resources,
                and community guidance into one place.
              </p>
            </div>
            <div className="profile-summary">
              <span>{user.branch}</span>
              <strong>{user.domain}</strong>
              <small>{user.goal}</small>
            </div>
          </section>

          {notice && (
            <div className="alert alert-success" role="alert">
              {notice}
            </div>
          )}
          {error && (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          )}

          <section className="dashboard-grid">
            <aside className="dashboard-sidebar">
              <div className="panel">
                <h2>Profile</h2>
                <div className="avatar-circle">{user.name.slice(0, 2).toUpperCase()}</div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <div className="profile-list">
                  <span>Branch: {user.branch}</span>
                  <span>Year: {user.year}</span>
                  <span>Goal: {user.goal}</span>
                </div>
                <Link className="btn btn-outline-dark w-100 mt-3" to="/register">
                  Edit Profile
                </Link>
              </div>

              <div className="panel">
                <h2>Skill Gap</h2>
                {learningRoadmaps.map((roadmap) => (
                  <div className="mini-progress" key={roadmap.title}>
                    <div>
                      <span>{roadmap.title}</span>
                      <strong>{roadmap.progress}%</strong>
                    </div>
                    <div className="progress slim-progress">
                      <div className="progress-bar" style={{ width: `${roadmap.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <section className="dashboard-main">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recommended Mentors</h2>
                    <p>Ranked by domain, skills, availability, rating, and mentoring history.</p>
                  </div>
                  <Link className="btn btn-primary" to={`/book-session/${recommendedMentors[0]?.id || 'g-aravindraj'}`}>
                    Quick Book
                  </Link>
                </div>

                <div className="filter-bar">
                  <input
                    className="form-control"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search mentor, skill, company, or domain"
                  />
                  <select
                    className="form-select"
                    value={selectedDomain}
                    onChange={(event) => setSelectedDomain(event.target.value)}
                  >
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mentor-list">
                  {recommendedMentors.map((mentor) => (
                    <article className="mentor-row" key={mentor.id}>
                      <img src={mentor.image} alt={mentor.name} />
                      <div className="mentor-row-content">
                        <div className="mentor-row-top">
                          <div>
                            <h3>{mentor.name}</h3>
                            <p>
                              {mentor.title}, {mentor.organization}
                            </p>
                          </div>
                          <span className="match-badge">{mentor.match}% match</span>
                        </div>
                        <div className="tag-row">
                          {mentor.skills.map((skill) => (
                            <span key={skill}>{skill}</span>
                          ))}
                        </div>
                        <div className="mentor-row-footer">
                          <span>{mentor.nextSlot}</span>
                          <div>
                            <button
                              className="btn btn-outline-dark btn-sm"
                              type="button"
                              onClick={() => handleConnect(mentor)}
                            >
                              Connect
                            </button>
                            <Link className="btn btn-primary btn-sm ms-2" to={`/book-session/${mentor.id}`}>
                              Book
                            </Link>
                            <Link className="btn btn-link btn-sm" to={`/mentor/${mentor.id}`}>
                              Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="content-columns">
                <section className="panel">
                  <h2>Upcoming Sessions</h2>
                  {sessions.length > 0 ? (
                    <div className="stack-list">
                      {sessions.slice(0, 3).map((session) => (
                        <div className="stack-item" key={session.id}>
                          <strong>{session.topic}</strong>
                          <span>
                            {session.mentorName} - {session.date} at {session.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-text">No sessions booked yet. Choose a mentor and book a slot.</p>
                  )}
                </section>

                <section className="panel">
                  <h2>Discussion Forum</h2>
                  <div className="stack-list">
                    {discussionPosts.map((post) => (
                      <div className="stack-item" key={post.title}>
                        <strong>{post.title}</strong>
                        <span>
                          {post.tag} - {post.replies} replies
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default StudentDashboard;
