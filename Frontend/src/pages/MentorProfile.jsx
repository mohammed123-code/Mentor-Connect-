import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mentors as fallbackMentors } from '../data/mockData';
import { createRequest, getMentor } from '../api';
import { getCurrentUser } from '../utils/demoStore';

function MentorProfile() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(fallbackMentors.find((item) => item.id === id));
  const user = getCurrentUser();
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getMentor(id)
      .then((response) => setMentor(response.data.mentor))
      .catch(() => setError('The selected profile is not available from the backend.'));
  }, [id]);

  if (!mentor) {
    return (
      <>
        <Navbar />
        <main className="dashboard-page">
          <div className="container">
            <div className="panel text-center">
              <h1>Mentor not found</h1>
              <p>The selected profile is not available.</p>
              <Link className="btn btn-primary" to="/student-dashboard">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleConnect = async () => {
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
      <main className="profile-page">
        <section className="profile-hero">
          <div className="container">
            <div className="profile-hero-grid">
              <img src={mentor.image} alt={mentor.name} />
              <div>
                <span className="eyebrow">{mentor.type}</span>
                <h1>{mentor.name}</h1>
                <p className="profile-title">
                  {mentor.title}, {mentor.organization}
                </p>
                <p>{mentor.bio}</p>
                <div className="profile-metrics">
                  <span>{mentor.rating} rating</span>
                  <span>{mentor.sessions} sessions</span>
                  <span>{mentor.match}% match</span>
                </div>
                <div className="hero-actions">
                  <Link className="btn btn-primary btn-lg" to={`/book-session/${mentor.id}`}>
                    Book Session
                  </Link>
                  <button className="btn btn-light btn-lg" type="button" onClick={handleConnect}>
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-page compact-top">
          <div className="container">
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

            <div className="profile-grid">
              <section className="panel">
                <h2>Expertise</h2>
                <div className="tag-row roomy">
                  {mentor.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </section>

              <section className="panel">
                <h2>Available Slots</h2>
                <div className="stack-list">
                  {mentor.availability.map((slot) => (
                    <div className="stack-item compact" key={slot}>
                      <strong>{slot}</strong>
                      <span>One-on-one mentoring</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <h2>Achievements</h2>
                <ul className="check-list">
                  {mentor.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="content-columns mt-4">
              <section className="panel">
                <h2>Suggested Roadmap</h2>
                <ol className="numbered-list">
                  {mentor.roadmap.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>

              <section className="panel">
                <h2>Shared Resources</h2>
                <div className="stack-list">
                  {mentor.resources.map((resource) => (
                    <div className="stack-item compact" key={resource}>
                      <strong>{resource}</strong>
                      <span>Ready for session follow-up</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="panel mt-4">
              <div className="panel-heading">
                <div>
                  <h2>Student Feedback</h2>
                  <p>Recent feedback from completed mentorship sessions.</p>
                </div>
                <Link className="btn btn-primary" to={`/book-session/${mentor.id}`}>
                  Book with {mentor.name.split(' ')[0]}
                </Link>
              </div>
              <div className="feedback-grid">
                {mentor.feedback.map((item) => (
                  <blockquote key={item.student}>
                    <p>{item.note}</p>
                    <cite>{item.student}</cite>
                  </blockquote>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default MentorProfile;
