import { Link } from "react-router-dom";
import { post } from "../../utils/ApiCaller";
import { useState } from "react";
// import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
  // const username = props.username;
  const handleLogout = async (e) => {
    // e.preventDefault();
    post("/user/logout")
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="logo" height="50" className="d-inline-block align-top" />
        </Link>
        {isLoggedIn ? (
          <>
            <ul className="navbar-nav mr-auto ml-5 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/album" className="nav-link">
                  My Albums
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/album-shared" className="nav-link">
                  Album Share With Me
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/photo-shared" className="nav-link">
                  Photo Share With Me
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto mb-lg-0">
              <li className="nav-item">
                <Link to="/change-password" className="nav-link">
                  Change Password
                </Link>
              </li>
              <li className="nav-item">
                <Link onClick={handleLogout} to="/log-in" className="nav-link">
                  Logout
                </Link>
              </li>
            </ul>
          </>
        ) : (
          <ul className="navbar-nav ml-auto mb-lg-0">
            <li className="nav-item">
              <Link to="/sign-up" className="nav-link">
                Sign Up
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/log-in" className="nav-link">
                Login
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
