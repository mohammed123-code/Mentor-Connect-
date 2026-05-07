import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="brand-lockup footer-brand" to="/">
              <span className="brand-mark">MC+</span>
              <span>Mentor Connect+</span>
            </Link>
            <p className="footer-copy">
              A MongoDB-backed mentoring platform for students, mentors, alumni, and admins.
            </p>
          </div>

          <div>
            <h2 className="footer-title">Platform</h2>
            <Link to="/student-dashboard">Student dashboard</Link>
            <Link to="/mentor-dashboard">Mentor dashboard</Link>
            <Link to="/admin-dashboard">Admin dashboard</Link>
          </div>

          <div>
            <h2 className="footer-title">Guidance</h2>
            <a href="/#mentors">Find mentors</a>
            <a href="/#domains">Explore domains</a>
            <Link to="/register">Join network</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>2026 Mentor Connect+</span>
          <span>Built for academic and career mentorship workflows.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
