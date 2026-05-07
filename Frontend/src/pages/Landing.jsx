import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { dashboardStats, domains, heroImage, learningRoadmaps, mentors as fallbackMentors } from '../data/mockData';
import { getMentors } from '../api';

function Landing() {
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [mentors, setMentors] = useState(fallbackMentors);

  useEffect(() => {
    getMentors()
      .then((response) => setMentors(response.data.mentors))
      .catch(() => setMentors(fallbackMentors));
  }, []);

  const visibleMentors = useMemo(() => {
    if (selectedDomain === 'All Domains') {
      return mentors.slice(0, 6);
    }

    return mentors.filter((mentor) => mentor.domain === selectedDomain);
  }, [mentors, selectedDomain]);

  return (
    <>
      <Navbar />

      <main>
        <section
          className="hero-section"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(15, 28, 32, 0.88), rgba(15, 28, 32, 0.48)), url(${heroImage})`,
          }}
        >
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow">Personalized student mentorship</span>
              <h1>Mentor Connect+</h1>
              <p>
                Match with faculty, alumni, and industry mentors based on your domain, skills,
                goals, and available time.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary btn-lg" to="/register">
                  Start as Student
                </Link>
                <Link className="btn btn-light btn-lg" to="/mentor-dashboard">
                  View Mentor Desk
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-strip">
          <div className="container">
            <div className="stats-grid">
              {dashboardStats.map((stat) => (
                <div className="stat-tile" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section" id="mentors">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Recommended matches</span>
              <h2>Find the right mentor faster</h2>
              <p>
                Browse a MongoDB-backed mentor directory with match scores, skills, availability,
                session booking, and detailed profile pages.
              </p>
            </div>

            <div className="domain-filter-scroll" aria-label="Mentor domains">
              {domains.map((domain) => (
                <button
                  className={`chip-button ${selectedDomain === domain ? 'active' : ''}`}
                  key={domain}
                  type="button"
                  onClick={() => setSelectedDomain(domain)}
                >
                  {domain}
                </button>
              ))}
            </div>

            <div className="mentor-grid">
              {visibleMentors.map((mentor) => (
                <article className="mentor-card" key={mentor.id}>
                  <img src={mentor.image} alt={mentor.name} />
                  <div className="mentor-card-body">
                    <div className="mentor-card-top">
                      <span className="match-badge">{mentor.match}% match</span>
                      <span className="rating-pill">{mentor.rating} rating</span>
                    </div>
                    <h3>{mentor.name}</h3>
                    <p className="mentor-title">
                      {mentor.title}, {mentor.organization}
                    </p>
                    <p>{mentor.bio}</p>
                    <div className="tag-row">
                      {mentor.skills.slice(0, 3).map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                    <div className="mentor-actions">
                      <Link className="btn btn-primary btn-sm" to={`/mentor/${mentor.id}`}>
                        View Profile
                      </Link>
                      <Link className="btn btn-outline-dark btn-sm" to={`/book-session/${mentor.id}`}>
                        Book Session
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section section-muted" id="domains">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Guided learning</span>
              <h2>Roadmaps and skill gaps in one place</h2>
              <p>
                Students can track learning plans while mentors share resources, review progress,
                and guide the next step.
              </p>
            </div>

            <div className="roadmap-grid">
              {learningRoadmaps.map((roadmap) => (
                <article className="roadmap-card" key={roadmap.title}>
                  <div className="roadmap-head">
                    <h3>{roadmap.title}</h3>
                    <span>{roadmap.progress}%</span>
                  </div>
                  <div className="progress slim-progress" role="progressbar" aria-valuenow={roadmap.progress}>
                    <div className="progress-bar" style={{ width: `${roadmap.progress}%` }}></div>
                  </div>
                  <ul className="check-list">
                    {roadmap.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="role-grid">
              <article className="role-panel">
                <span className="eyebrow">Students</span>
                <h2>Discover, request, book, and learn</h2>
                <p>
                  The student dashboard brings recommendations, upcoming sessions, skill roadmaps,
                  resources, and discussion threads into a single workspace.
                </p>
                <Link className="btn btn-primary" to="/student-dashboard">
                  Open Student Dashboard
                </Link>
              </article>
              <article className="role-panel">
                <span className="eyebrow">Mentors and alumni</span>
                <h2>Manage requests and guide progress</h2>
                <p>
                  Mentors can accept student requests, monitor sessions, share resources, maintain
                  availability, and track student goals from a focused dashboard.
                </p>
                <Link className="btn btn-outline-dark" to="/mentor-dashboard">
                  Open Mentor Dashboard
                </Link>
              </article>
              <article className="role-panel">
                <span className="eyebrow">Admin</span>
                <h2>Keep the network organized</h2>
                <p>
                  Admin screens cover mentor verification, user status, domain coverage, reports,
                  and activity monitoring for the institution.
                </p>
                <Link className="btn btn-outline-dark" to="/admin-dashboard">
                  Open Admin Dashboard
                </Link>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Landing;
