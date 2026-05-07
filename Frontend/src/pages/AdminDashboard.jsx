import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { adminUsers, domains, mentors as fallbackMentors } from '../data/mockData';
import { getAdminStats, getAdminUsers, getMentors, updateAdminUserStatus } from '../api';

function AdminDashboard() {
  const [users, setUsers] = useState(adminUsers);
  const [mentors, setMentors] = useState(fallbackMentors);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAdminUsers(), getAdminStats(), getMentors()])
      .then(([usersResponse, statsResponse, mentorsResponse]) => {
        setUsers(usersResponse.data.users);
        setStats(statsResponse.data.stats);
        setMentors(mentorsResponse.data.mentors);
      })
      .catch((error) => {
        setError(error.response?.data?.message || 'Unable to load admin data. Please login as admin.');
      });
  }, []);

  const updateUserStatus = async (id, status) => {
    try {
      const response = await updateAdminUserStatus(id, status);
      setUsers((current) => current.map((user) => (user.id === id ? response.data.user : user)));
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to update user status.');
    }
  };

  const domainCoverage = domains
    .filter((domain) => domain !== 'All Domains')
    .map((domain) => ({
      domain,
      mentors: mentors.filter((mentor) => mentor.domain === domain).length,
    }));

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="container">
          <section className="dashboard-hero admin-hero">
            <div>
              <span className="eyebrow">Admin workspace</span>
              <h1>Institution mentoring control center</h1>
              <p>
                Verify mentors, monitor platform activity, review domain coverage, and keep the
                mentoring network organized.
              </p>
            </div>
            <div className="profile-summary">
              <span>Admin</span>
              <strong>Mentor Connect+</strong>
              <small>Users, domains, reports, and activity</small>
            </div>
          </section>

          <section className="stats-grid dashboard-stats">
            <div className="stat-tile">
              <strong>{stats?.users ?? users.length}</strong>
              <span>Total users</span>
            </div>
            <div className="stat-tile">
              <strong>{stats?.pendingUsers ?? users.filter((user) => user.status === 'Pending').length}</strong>
              <span>Pending verification</span>
            </div>
            <div className="stat-tile">
              <strong>{stats?.mentors ?? mentors.length}</strong>
              <span>Mentor profiles</span>
            </div>
            <div className="stat-tile">
              <strong>{stats?.domains ?? domainCoverage.length}</strong>
              <span>Active domains</span>
            </div>
          </section>

          {error && (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          )}

          <section className="dashboard-grid admin-grid">
            <div className="dashboard-main">
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>User Management</h2>
                    <p>Verify mentors, monitor student status, and review profile categories.</p>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Domain</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id || user.name}>
                          <td>{user.name}</td>
                          <td>{user.role}</td>
                          <td>{user.domain}</td>
                          <td>
                            <span className={`status-pill ${user.status.toLowerCase()}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              type="button"
                              onClick={() => updateUserStatus(user.id, 'Verified')}
                            >
                              Verify
                            </button>
                            <button
                              className="btn btn-outline-dark btn-sm"
                              type="button"
                              onClick={() => updateUserStatus(user.id, 'Suspended')}
                            >
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <aside className="dashboard-sidebar">
              <section className="panel">
                <h2>Domain Coverage</h2>
                <div className="stack-list">
                  {domainCoverage.map((item) => (
                    <div className="stack-item compact" key={item.domain}>
                      <strong>{item.domain}</strong>
                      <span>{item.mentors} mentor profiles</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <h2>Platform Reports</h2>
                <div className="stack-list">
                  <div className="stack-item compact">
                    <strong>Mentor verification</strong>
                    <span>2 profiles need review</span>
                  </div>
                  <div className="stack-item compact">
                    <strong>Session feedback</strong>
                    <span>18 new feedback entries</span>
                  </div>
                  <div className="stack-item compact">
                    <strong>Resource uploads</strong>
                    <span>7 files awaiting category labels</span>
                  </div>
                </div>
              </section>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminDashboard;
