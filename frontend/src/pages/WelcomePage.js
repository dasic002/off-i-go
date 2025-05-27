import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link } from "react-router-dom";

import styles from "../styles/WelcomePage.module.css";
import btnStyles from "../styles/Button.module.css";
import appStyles from "../App.module.css";

function WelcomePage() {
  return (
    <Container>
      <Row className="mt-3">
        <Col className="my-auto p-0 p-md-2">
          <Container className={`${appStyles.Content} p-4 `}>
            <h1>Welcome to Off I Go!</h1>
            <p>
              <strong>Your Community for Confident, Accessible Journeys</strong>
            </p>
            <p>
              Off I Go is built with disabled people in mind — a space where you
              can plan your journeys with confidence, connect with others, and
              get the right support every step of the way.
            </p>
            <p>
              Here, you'll find real advice from people who have been there,
              insights into the accessibility of services and sites, and direct
              connections to Service and Support Providers who are ready to
              help. Whether you're commuting, exploring a new spot, or simply
              navigating daily life, Off I Go brings together the tools and
              community to help you get where you're going — your way.
            </p>
            <ul>
              <li>
                <strong>Service Providers</strong> can register to share
                accessibility features, visitor support, and contact info.
              </li>
              <li>
                <strong>Support Providers</strong> can offer advice, resources,
                and updates on rights, health, and independence.
              </li>
              <li>
                <strong>Social Users</strong> can share their wins and
                challenges, recommend places, and connect with others who get
                it.
              </li>
            </ul>
            <p>Wherever you're headed — you're not alone. Off you go.</p>
            <div className="text-center">
              <Button
                as={Link}
                to="/signup"
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                variant="primary"
              >
                Join our community
              </Button>
            </div>
          </Container>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <div className="my-auto p-0 p-md-2">
          <Image
            className={styles.WelcomeImg}
            src={
              "https://res.cloudinary.com/dnepttq4h/image/upload/v1748357228/Asset_5_400x_zoe2vm.png"
            }
            alt="Welcome to Off I Go"
          />
        </div>
      </Row>
    </Container>
  );
}

export default WelcomePage;
