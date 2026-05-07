import { Link, useNavigate } from 'react-router-dom';
import { clearCurrentUser, getStoredUser } from '../utils/demoStore';

const dashboardPath = (role) => {
  if (role === 'mentor') return '/mentor-dashboard';
  if (role === 'admin') return '/admin-dashboard';
  return '/student-dashboard';
};

function Navbar() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light app-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand brand-lockup" to="/">
          <span className="brand-mark">MC+</span>
          <span>Mentor Connect+</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#mentors">
                Mentors
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#domains">
                Domains
              </a>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={dashboardPath(user.role)}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <button className="btn btn-outline-dark btn-sm" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-outline-dark btn-sm" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <Link className="btn btn-primary btn-sm" to="/register">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
