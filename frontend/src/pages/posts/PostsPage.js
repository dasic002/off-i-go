import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import InfiniteScroll from "react-infinite-scroll-component";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import { useSetGeoPosition } from "../../contexts/GeoPositionContext";
import { Button } from "react-bootstrap";

const NoResults = <i className="fa-solid fa-ghost"></i>;

function PostsPage({ message, filter = "", nearMe }) {
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const { handleGeoPosUpdate, handleGeoPosReset, handleRadiusUpdate } =
    useSetGeoPosition();

  const [isHome, setIsHome] = useState(false);

  const [query, setQuery] = useState("");

  const [radius, setRadius] = useState(30); // Default radius in km

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(
          `/posts/?${filter}&search=${query}`
        );
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000); // 1 second delay
    return () => {
      clearTimeout(timer);
    };
  }, [filter, pathname, query]);

  function handleLiveLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    handleGeoPosUpdate(latitude, longitude, radius);
  }

  function error() {
    console.log("Unable to retrieve your location.");
  }

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <div className={nearMe ? "d-flex justify-content-between" : ""}>
          <i className={`fas fa-search ${styles.SearchIcon}`} />
          <Form
            className={styles.SearchBar}
            onSubmit={(e) => e.preventDefault()}
          >
            <Form.Control
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              className="mr-sm-2"
              placeholder="Search posts"
            />
          </Form>
          {nearMe && (
            <>
              <Form
                className={`${styles.RadiusBar} d-flex`}
                onSubmit={(e) => e.preventDefault()}
              >
                <Form.Label className="mt-2">Radius (km)</Form.Label>
                <Form.Control
                  value={radius}
                  onChange={(e) => {
                    setRadius(e.target.value);
                    handleRadiusUpdate(e.target.value);
                  }}
                  type="number"
                  min="1"
                />
                <Button
                  onClick={() => {
                    setIsHome(false);
                    handleLiveLocationClick();
                  }}
                  className={btnStyles.SqButton}
                  aria-label="Live Location"
                  active={!isHome}
                >
                  <i className="fas fa-map-marker-alt" />
                </Button>
                <Button
                  onClick={() => {
                    setIsHome(true);
                    handleGeoPosReset();
                  }}
                  className={btnStyles.SqButton}
                  aria-label="Home Location"
                  active={isHome}
                >
                  <i className="fas fa-home" />
                </Button>
              </Form>
            </>
          )}
        </div>
        {hasLoaded ? (
          <>
            {posts.results.length ? (
              <InfiniteScroll
                children={posts.results.map((post) => (
                  <Post key={post.id} {...post} setPosts={setPosts} />
                ))}
                dataLength={posts.results.length}
                loader={<Asset spinner />}
                hasMore={!!posts.next}
                next={() => fetchMoreData(posts, setPosts)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset icon={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostsPage;
