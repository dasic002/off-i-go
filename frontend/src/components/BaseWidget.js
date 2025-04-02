import React, { useContext } from "react";
import { ButtonGroup, DropdownButton } from "react-bootstrap";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import styles from "../styles/BaseWidget.module.css";
import { Nav } from "react-bootstrap";
import { DeviceSizeContext } from "../App";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const BaseWidget = () => {
  const currentUser = useCurrentUser();
  const device = useContext(DeviceSizeContext);
  const loggedInIcons = <>{currentUser?.username}</>;
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signup"
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <div
      className={
        device === "mobile"
          ? styles.BaseWidget
          : styles.BaseWidget + " " + styles.MessageWidget
      }
    >
      <ButtonGroup className={`d-flex flex-row justify-content-between ${styles.ButtonGroup}`}>
        <NavLink
          className={styles.NavLink}
          activeClassName={styles.Active}
          to="/signin"
        >
          <i className="fas fa-sign-in-alt"></i>Sign in
        </NavLink>
        {device === "mobile" ? (
          <>
            <DropdownButton
              as={ButtonGroup}
              key="widget-nav-bar"
              id="widget-nav-bar"
              drop="up"
              title={<i class="fa-solid fa-bars"></i>}
              variant="DropNav"
            >
              <Nav className={`ml-auto text-right`}>
                <NavLink
                  exact
                  className={styles.NavLink}
                  activeClassName={styles.Active}
                  to="/"
                >
                  <i className="fas fa-home"></i>Home
                </NavLink>
                {currentUser ? loggedInIcons : loggedOutIcons}
              </Nav>
            </DropdownButton>
          </>
        ) : (
          ""
        )}
      </ButtonGroup>
    </div>
  );
};

export default BaseWidget;
