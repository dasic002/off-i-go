import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { Alert, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

const Upload = <i className="fa-solid fa-cloud-arrow-up"></i>;

function PostCreateForm() {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    body: "",
    media: "",
    tags: "",
    listing_type: 3,
    latitude: "",
    longitude: "",
  });

  const { title, body, media, tags, listing_type, latitude, longitude } =
    postData;

  const [coordsFetch, setCoordsFetch] = useState({
    fetching: false,
    error: "",
  });

  const imageInput = useRef(null);
  const history = useHistory();

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(media);
      setPostData({
        ...postData,
        media: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const locationOptions = {
    enableHighAccuracy: false,
    timeout: 30000,
    maximumAge: 5000,
  };

  const cachedLocationOptions = {
    enableHighAccuracy: false,
    maximumAge: 600000, // 10 minutes
    timeout: 3000,
  };

  function handleLiveLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, locationOptions);
      setCoordsFetch({
        fetching: true,
        error: "",
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
      setCoordsFetch({
        fetching: true,
        error: "Geolocation is not supported by this browser.",
      });
      clearCoordsFetch();
    }
  }

  function handleCachedLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        success,
        error,
        cachedLocationOptions
      );
      setCoordsFetch({
        fetching: true,
        error: "",
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
      setCoordsFetch({
        fetching: true,
        error: "Geolocation is not supported by this browser.",
      });
      clearCoordsFetch();
    }
  }

  function success(position) {
    setPostData({
      ...postData,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    setCoordsFetch({
      fetching: false,
      error: "",
    });
  }

  function error() {
    console.log("Unable to retrieve your location.");
    setCoordsFetch({
      fetching: true,
      error: "Unable to retrieve your location.",
    });
    clearCoordsFetch();
  }

  function clearCoordsFetch() {
    setTimeout(() => {
      setCoordsFetch({
        fetching: false,
        error: "",
      });
    }, 3000);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imageInput.current.files.length < 1) {
      handlePostSubmit();
    } else {
      const mediaData = new FormData();
      mediaData.append("image", imageInput.current.files[0]);

      try {
        const { data } = await axiosReq.post("/medias/", mediaData);
        console.log(data);
        handlePostSubmit(data.id);
      } catch (err) {
        console.log(err);
        if (err.response?.status !== 401) {
          setErrors(err.response?.data);
        }
      }
    }
  };

  const handlePostSubmit = async (medias) => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("body", body);
    if (medias) formData.append("media", medias);
    if (tags) formData.append("tags", tags);
    formData.append("listing_type", listing_type);
    if (latitude) formData.append("latitude", latitude);
    if (longitude) formData.append("longitude", longitude);

    try {
      const { data } = await axiosReq.post("/posts/", formData);
      console.log(data);
      history.push(`/posts/${data.id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="Title goes here"
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group controlId="body">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          name="body"
          rows={6}
          value={body}
          onChange={handleChange}
          placeholder="Post content here"
        />
      </Form.Group>
      {errors?.body?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Location - latitude</Form.Label>
        <Form.Control
          type="text"
          value={latitude}
          onChange={handleChange}
          name="latitude"
          placeholder="Latitude"
        />
        <Form.Label>Location - longitude</Form.Label>
        <Form.Control
          type="text"
          value={longitude}
          onChange={handleChange}
          name="longitude"
          placeholder="Longitude"
        />
        {errors?.latitude?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
        {errors?.longitude?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
        <div className="my-2">
          <Button
            onClick={() => {
              handleLiveLocationClick();
            }}
            className={`${btnStyles.Button} ${btnStyles.Blue}`}
            aria-label="Get Live Location"
            disabled={coordsFetch.fetching}
          >
            Get Live Location
          </Button>
          {coordsFetch.fetching &&
            (coordsFetch.error === "" ? (
              <Alert variant="info" key="location-alert" className="mt-2">
                <i className="fa-solid fa-spinner fa-spin ms-2"></i>
                Retrieving Location...
              </Alert>
            ) : (
              <Alert variant="warning" key="location-alert" className="mt-2">
                <i className="fa-solid fa-triangle-exclamation ms-2"></i>
                {coordsFetch.error}
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Blue} ms-2`}
                  onClick={() => {
                    handleCachedLocationClick();
                  }}
                  aria-label="Try Cached Location instead"
                >
                  Try Cached Location
                </Button>
              </Alert>
            ))}
        </div>
      </Form.Group>
      <Form.Group as={Row} controlId="tags">
        <Form.Label column sm={2}>
          Tags
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            name="tags"
            value={tags}
            onChange={handleChange}
            placeholder="separate tags with spaces"
          />
        </Col>
      </Form.Group>
      {errors?.tags?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group as={Row} controlId="listing_type">
        <Form.Label column sm={5}>
          Listing Type
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            as="select"
            name="listing_type"
            value={listing_type}
            onChange={handleChange}
          >
            <option value={0}>Draft</option>
            <option value={1}>Private</option>
            <option value={2}>Unlisted</option>
            <option value={3}>Public</option>
          </Form.Control>
        </Col>
      </Form.Group>
      {errors?.listing_type?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        create
      </Button>
      {errors?.non_field_errors?.map((message, idx) => (
        <Alert variant="warning" key={idx} className="mt-3">
          {message}
        </Alert>
      ))}
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {media ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={media} rounded />
                    {/* <video className={appStyles.Image} src={media} controls /> */}
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn btn-primary`}
                      htmlFor="media-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="media-upload"
                >
                  <Asset
                    icon={Upload}
                    message="Click or tap to upload an image"
                  />
                </Form.Label>
              )}

              <Form.File
                id="media-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostCreateForm;
