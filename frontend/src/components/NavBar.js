import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import { useDeviceSize } from "../contexts/DeviceSizeContext";
import Avatar from "./Avatar";
import axios from "axios";
import BaseWidget from "./BaseWidget";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const device = useDeviceSize();
  // const history = useHistory();

  const handleSignOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const addPostIcon = (
    <NavLink
      className={`${styles.NavLink} ${device === 'mobile' && 'm-auto'}`}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i class="fa-solid fa-square-plus"></i>
      <span className={device === 'mobile' && 'd-none'}>Add Post</span>
    </NavLink>
  );

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/discover"
      >
        <i class="fa-solid fa-earth-europe"></i>
        <span className="d-md-none d-lg-inline">Discover</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>
        <span className="d-md-none d-lg-inline">Feed</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/for-me"
      >
        <i class="fa-solid fa-hashtag"></i>
        <span className="d-md-none d-lg-inline">For me</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/near-me"
      >
        <i class="fa-solid fa-location-dot"></i>
        <span className="d-md-none d-lg-inline">Near me</span>
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>
        <span className="d-md-none d-lg-inline">Sign out</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} height={40} text="Profile" />
      </NavLink>
    </>
  );
  const loggedOutIcons = (
    <>
      <NavLink
        exact
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/"
      >
        <i className="fas fa-home"></i>
        <span>Home</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>
        <span>Sign in</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signup"
      >
        <i className="fas fa-user-plus"></i>
        <span>Sign up</span>
      </NavLink>
    </>
  );

  return (
    <>
      <Navbar expand="md" fixed="top" className={styles.NavBar}>
        <Container>
          <NavLink to="/">
            <Navbar.Brand className={styles.Brand}>Off I Go</Navbar.Brand>
          </NavLink>
          {device === "mobile" ? (
            <>
              <i class="fa-solid fa-magnifying-glass"></i>
            </>
          ) : (
            <>
              {currentUser && addPostIcon}
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto text-right">
                  {currentUser ? loggedInIcons : loggedOutIcons}
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
      <BaseWidget
        NavBarLinks={currentUser ? loggedInIcons : loggedOutIcons}
        AddPostLink={addPostIcon}
      />
    </>
  );
};

export default NavBar;
