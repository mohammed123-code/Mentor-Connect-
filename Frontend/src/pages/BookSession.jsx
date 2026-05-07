import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mentors as fallbackMentors } from '../data/mockData';
import { createSession, getMentor } from '../api';

function BookSession() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(fallbackMentors.find((item) => item.id === id) || fallbackMentors[0]);
  const [confirmedSession, setConfirmedSession] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    topic: '',
    date: '',
    slot: mentor.availability[0],
    mode: 'Google Meet',
    notes: '',
  });

  useEffect(() => {
    getMentor(id)
      .then((response) => {
        setMentor(response.data.mentor);
        setFormData((current) => ({
          ...current,
          slot: response.data.mentor.availability[0] || current.slot,
        }));
      })
      .catch(() => setError('Unable to load this mentor from the backend. Showing fallback data.'));
  }, [id]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await createSession({
        mentorId: mentor.id,
        topic: formData.topic || `${mentor.domain} guidance`,
        date: formData.date,
        time: formData.slot,
        mode: formData.mode,
        notes: formData.notes,
      });
      setConfirmedSession(response.data.session);
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to book session.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="booking-page">
        <div className="container">
          <section className="booking-grid">
            <aside className="booking-mentor">
              <img src={mentor.image} alt={mentor.name} />
              <span className="eyebrow">{mentor.domain}</span>
              <h1>{mentor.name}</h1>
              <p>
                {mentor.title}, {mentor.organization}
              </p>
              <div className="profile-metrics">
                <span>{mentor.rating} rating</span>
                <span>{mentor.sessions} sessions</span>
                <span>{mentor.experience}</span>
              </div>
              <div className="tag-row roomy">
                {mentor.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </aside>

            <section className="booking-panel">
              {error && (
                <div className="alert alert-warning" role="alert">
                  {error}
                </div>
              )}
              {confirmedSession ? (
                <div className="success-panel">
                  <span className="eyebrow">Session confirmed</span>
                  <h2>{confirmedSession.topic}</h2>
                  <p>
                    Your session with {confirmedSession.mentorName} is scheduled for{' '}
                    {confirmedSession.date} at {confirmedSession.time}.
                  </p>
                  <div className="stack-list">
                    <div className="stack-item compact">
                      <strong>Mode</strong>
                      <span>{confirmedSession.mode}</span>
                    </div>
                    <div className="stack-item compact">
                      <strong>Status</strong>
                      <span>{confirmedSession.status}</span>
                    </div>
                  </div>
                  <div className="hero-actions">
                    <Link className="btn btn-primary" to="/student-dashboard">
                      Student Dashboard
                    </Link>
                    <Link className="btn btn-outline-dark" to={`/mentor/${mentor.id}`}>
                      Mentor Profile
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">Book session</span>
                      <h2>Choose a guidance slot</h2>
                      <p>Complete the session details and save the booking in frontend storage.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="topic">
                        Session topic
                      </label>
                      <input
                        className="form-control"
                        id="topic"
                        name="topic"
                        type="text"
                        value={formData.topic}
                        onChange={handleChange}
                        placeholder="Resume review, project guidance, internship preparation"
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label" htmlFor="date">
                          Date
                        </label>
                        <input
                          className="form-control"
                          id="date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label" htmlFor="mode">
                          Meeting mode
                        </label>
                        <select
                          className="form-select"
                          id="mode"
                          name="mode"
                          value={formData.mode}
                          onChange={handleChange}
                        >
                          <option>Google Meet</option>
                          <option>Zoom</option>
                          <option>Campus counselling room</option>
                          <option>Phone call</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Available slots</label>
                      <div className="slot-grid">
                        {mentor.availability.map((slot) => (
                          <label className={formData.slot === slot ? 'active' : ''} key={slot}>
                            <input
                              type="radio"
                              name="slot"
                              value={slot}
                              checked={formData.slot === slot}
                              onChange={handleChange}
                            />
                            <span>{slot}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label" htmlFor="notes">
                        Notes for mentor
                      </label>
                      <textarea
                        className="form-control"
                        id="notes"
                        name="notes"
                        rows="4"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Share your current situation, questions, or files to review"
                      ></textarea>
                    </div>

                    <button className="btn btn-primary btn-lg w-100" type="submit">
                      Confirm Booking
                    </button>
                  </form>
                </>
              )}
            </section>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default BookSession;
