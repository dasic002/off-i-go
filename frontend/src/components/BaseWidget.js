import React from "react";
import {
  ButtonGroup,
  Col,
  Container,
  Navbar,
  Row,
} from "react-bootstrap";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import styles from "../styles/BaseWidget.module.css";
import { Nav } from "react-bootstrap";
import { useDeviceSize } from "../contexts/DeviceSizeContext";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const BaseWidget = ({ NavBarLinks, AddPostLink }) => {
  const device = useDeviceSize();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  return (
    <div
      className={
        device === "mobile"
          ? styles.BaseWidget
          : styles.BaseWidget + " " + styles.MessageWidget
      }
    >
      <ButtonGroup
        className={`d-flex flex-row justify-space-between ${styles.ButtonGroup}`}
      >
        <Container>
          <Row>
            <Col className="d-flex p-0">
              <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/messages"
              >
                <i className="fa-solid fa-envelope"></i>
                <span className="d-none d-md-inline">Messages</span>
              </NavLink>
            </Col>
            {device === "mobile" ? (
              <>
                <Col className="d-flex p-0">{AddPostLink}</Col>
                <Col className="d-flex p-0">
                  <Navbar
                    expand="lg"
                    expanded={expanded}
                    className={styles.NavBar}
                    id="widget-nav-bar"
                  >
                    <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className={`ml-auto text-left p-0`}>{NavBarLinks}</Nav>
                    </Navbar.Collapse>
                    <Navbar.Toggle
                      ref={ref}
                      onClick={() => setExpanded(!expanded)}
                      aria-controls="basic-navbar-nav"
                      className={styles.Toggle}
                    ><i className="fa-solid fa-bars"></i></Navbar.Toggle>
                  </Navbar>
                </Col>
              </>
            ) : (
              ""
            )}
          </Row>
        </Container>
      </ButtonGroup>
    </div>
  );
};

export default BaseWidget;
