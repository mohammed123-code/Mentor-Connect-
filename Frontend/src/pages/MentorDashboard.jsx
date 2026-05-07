import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { incomingRequests, mentors as fallbackMentors } from '../data/mockData';
import {
  addMentorResource,
  getMentor,
  getRequests,
  getSessions,
  updateRequestStatus,
} from '../api';
import { getStoredUser } from '../utils/demoStore';

function MentorDashboard() {
  const storedUser = getStoredUser();
  const [mentorProfile, setMentorProfile] = useState(fallbackMentors[0]);
  const user =
    storedUser?.role === 'mentor'
      ? storedUser
      : {
          name: fallbackMentors[0].name,
          email: 'aravindraj@mentorconnect.test',
          title: fallbackMentors[0].title,
          company: fallbackMentors[0].organization,
          role: 'mentor',
        };

  const [requests, setRequests] = useState(incomingRequests);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resources, setResources] = useState(mentorProfile.resources);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const profileId = storedUser?.slug || storedUser?.id || 'g-aravindraj';

    Promise.all([getMentor(profileId), getRequests(), getSessions()])
      .then(([mentorResponse, requestResponse, sessionResponse]) => {
        setMentorProfile(mentorResponse.data.mentor);
        setResources(mentorResponse.data.mentor.resources);
        setRequests(requestResponse.data.requests);
        setSessions(sessionResponse.data.sessions);
      })
      .catch((error) => {
        setError(error.response?.data?.message || 'Unable to load live mentor data. Please login as a mentor.');
      });
  }, [storedUser?.id, storedUser?.slug]);

  const dashboardNumbers = useMemo(
    () => [
      { label: 'Students guided', value: mentorProfile.students },
      { label: 'Sessions delivered', value: mentorProfile.sessions },
      { label: 'Average rating', value: mentorProfile.rating },
      { label: 'Pending requests', value: requests.filter((request) => request.status === 'Pending').length },
    ],
    [mentorProfile.rating, mentorProfile.sessions, mentorProfile.students, requests],
  );

  const updateRequest = async (id, status) => {
    try {
      const response = await updateRequestStatus(id, status);
      setRequests((current) =>
        current.map((request) => (request.id === id ? response.data.request : request)),
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to update request status.');
    }
  };

  const handleResourceSubmit = async (event) => {
    event.preventDefault();
    const title = resourceTitle.trim();
    if (!title) return;
    try {
      const response = await addMentorResource(title);
      setResources(response.data.resources);
      setResourceTitle('');
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to add resource.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="container">
          <section className="dashboard-hero mentor-hero">
            <div>
              <span className="eyebrow">Mentor workspace</span>
              <h1>{user.name}</h1>
              <p>
                Manage student requests, upcoming sessions, shared learning resources, and
                availability from a single mentoring desk.
              </p>
            </div>
            <div className="profile-summary">
              <span>{user.title || mentorProfile.title}</span>
              <strong>{user.company || mentorProfile.organization}</strong>
              <small>{mentorProfile.domain}</small>
            </div>
          </section>

          <section className="stats-grid dashboard-stats">
            {dashboardNumbers.map((item) => (
              <div className="stat-tile" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </section>

          {error && (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          )}

          <section className="dashboard-grid">
            <aside className="dashboard-sidebar">
              <div className="panel mentor-profile-panel">
                <img src={mentorProfile.image} alt={mentorProfile.name} />
                <h2>{mentorProfile.name}</h2>
                <p>
                  {mentorProfile.title}, {mentorProfile.organization}
                </p>
                <div className="tag-row">
                  {mentorProfile.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="panel">
                <h2>Availability</h2>
                <div className="stack-list">
                  {mentorProfile.availability.map((slot) => (
                    <div className="stack-item compact" key={slot}>
                      <strong>{slot}</strong>
                      <span>Open for booking</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <section className="dashboard-main">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Student Requests</h2>
                    <p>Review guidance goals and confirm the best session fit.</p>
                  </div>
                </div>

                <div className="request-list">
                  {requests.map((request) => (
                    <article className="request-row" key={request.id}>
                      <div>
                        <span className={`status-pill ${request.status.toLowerCase()}`}>
                          {request.status}
                        </span>
                        <h3>{request.student}</h3>
                        <p>
                          {request.branch} - {request.goal}
                        </p>
                        <small>{request.requestedFor}</small>
                      </div>
                      <div className="request-actions">
                        {request.status !== 'Accepted' && (
                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            onClick={() => updateRequest(request.id, 'Accepted')}
                          >
                            Accept
                          </button>
                        )}
                        {request.status !== 'Rejected' && (
                          <button
                            className="btn btn-outline-dark btn-sm"
                            type="button"
                            onClick={() => updateRequest(request.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        )}
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
                      {sessions.slice(0, 4).map((session) => (
                        <div className="stack-item" key={session.id}>
                          <strong>{session.topic}</strong>
                          <span>
                            {session.studentName} - {session.date} at {session.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-text">Booked student sessions will appear here.</p>
                  )}
                </section>

                <section className="panel">
                  <h2>Resource Sharing</h2>
                  <form className="resource-form" onSubmit={handleResourceSubmit}>
                    <input
                      className="form-control"
                      type="text"
                      value={resourceTitle}
                      onChange={(event) => setResourceTitle(event.target.value)}
                      placeholder="Add resource title"
                    />
                    <button className="btn btn-primary" type="submit">
                      Add
                    </button>
                  </form>
                  <div className="stack-list">
                    {resources.map((resource) => (
                      <div className="stack-item compact" key={resource}>
                        <strong>{resource}</strong>
                        <span>Shared with mentees</span>
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

export default MentorDashboard;
