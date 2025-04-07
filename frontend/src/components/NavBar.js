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
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";


const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const device = useDeviceSize();
  const mobile = device === "mobile" ? true : false;

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const [pathname, setPathname] = React.useState(window.location.pathname);

  const handleSignOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const addPostIcon = (
    <>
      <NavLink
        className={`${styles.NavLink} ${mobile ? "m-auto" : ""}`}
        activeClassName={styles.Active}
        to="/posts/create"
      >
        <i className="fa-solid fa-square-plus"></i>
        <span className={mobile ? "d-none" : ""}>Add Post</span>
      </NavLink>
    </>
  );

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/discover"
        onClick={() => setPathname("/discover")}
      >
        <i className="fa-solid fa-earth-europe"></i>
        <span className={`${pathname !== '/discover' && 'd-md-none'} d-lg-inline`}>Discover</span>
        {/* <span className="d-md-none d-lg-inline">Discover</span> */}
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
        onClick={() => setPathname("/feed")}
      >
        <i className="fas fa-stream"></i>
        <span className={`${pathname !== '/feed' && 'd-md-none'} d-lg-inline`}>Feed</span>
        {/* <span className="d-md-none d-lg-inline">Feed</span> */}
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/for-me"
        onClick={() => setPathname("/for-me")}
      >
        <i className="fa-solid fa-hashtag"></i>
        <span className={`${pathname !== '/for-me'  && 'd-md-none'} d-lg-inline`}>For me</span>
        {/* <span className="d-md-none d-lg-inline">For me</span> */}
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/near-me"
        onClick={() => setPathname("/near-me")}
      >
        <i className="fa-solid fa-location-dot"></i>
        <span className={`${pathname !== '/near-me' && 'd-md-none'} d-lg-inline`}>Near me</span>
        {/* <span className="d-md-none d-lg-inline">Near me</span> */}
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
      <Navbar
        expanded={expanded}
        expand="md"
        fixed="top"
        className={styles.NavBar}
      >
        <Container>
          <NavLink to="/">
            <Navbar.Brand className={styles.Brand}>Off I Go</Navbar.Brand>
          </NavLink>
          {mobile ? (
            <>
              <i className="fa-solid fa-magnifying-glass"></i>
            </>
          ) : (
            <>
              {currentUser && addPostIcon}
              <Navbar.Toggle
                ref={ref}
                onClick={() => setExpanded(!expanded)}
                aria-controls="basic-navbar-nav"
                className={styles.Toggle}
              >
                <i className="fa-solid fa-bars"></i>
              </Navbar.Toggle>
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
