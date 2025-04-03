import React from "react";
import {
  ButtonGroup,
  Col,
  Container,
  DropdownButton,
  Row,
} from "react-bootstrap";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import styles from "../styles/BaseWidget.module.css";
import { Nav } from "react-bootstrap";
import { useDeviceSize } from "../contexts/DeviceSizeContext";

const BaseWidget = ({ NavBarLinks, AddPostLink }) => {
  const device = useDeviceSize();

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
                <i class="fa-solid fa-envelope"></i>
                <span className="d-none d-md-inline">Messages</span>
              </NavLink>
            </Col>
            {device === "mobile" ? (
              <>
                <Col className="d-flex p-0">{AddPostLink}</Col>
                <Col className="d-flex p-0">
                  <DropdownButton
                    as={ButtonGroup}
                    key="widget-nav-bar"
                    id="widget-nav-bar"
                    drop="up"
                    title={<i class="fa-solid fa-bars"></i>}
                    variant="DropNav"
                    className="ml-auto"
                  >
                    <Nav className={`ml-auto text-left`}>
                      {NavBarLinks}
                    </Nav>
                  </DropdownButton>
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
