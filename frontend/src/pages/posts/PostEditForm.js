import React, { useEffect, useRef, useState } from "react";

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
import { useParams } from "react-router-dom/cjs/react-router-dom";

const Upload = <i className="fa-solid fa-cloud-arrow-up"></i>;

function PostEditForm() {
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    body: "",
    media: "",
    tags: "",
    listing_type: 3,
    latitude: null,
    longitude: null,
  });

  const { title, body, media, tags, listing_type, latitude, longitude } =
    postData;

  const [mediaData, setMediaData] = useState({
    media_id: 0,
    media_type: 0,
    image: "",
    video: "",
  });

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        const {
          title,
          body,
          media,
          tags,
          listing_type,
          is_owner,
          latitude,
          longitude,
        } = data;

        is_owner
          ? setPostData({
              title,
              body,
              media,
              tags,
              listing_type,
              latitude,
              longitude,
            })
          : history.push("/discover");
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id, history]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const { data } = await axiosReq.get(`/medias/${media[0]}/`);
        const { id: media_id, media_type, image, video, is_owner } = data;

        is_owner
          ? setMediaData({ media_id, media_type, image, video })
          : history.push("/discover");
      } catch (err) {
        console.log(err);
      }
    };

    if (media.length) {
      getMedia();
    }
  }, [media, history]);

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(mediaData.image);
      setMediaData({
        ...mediaData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  function handleLiveLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function success(position) {
    setPostData({
      ...postData,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }

  function error() {
    console.log("Unable to retrieve your location.");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imageInput?.current?.files[0] === undefined) {
      console.log("no files to upload, submitting post");
      handlePostSubmit(mediaData.media_id);
    } else {
      const formData = new FormData();
      if (imageInput?.current?.files[0]) {
        console.log("seeing a file to upload");
        formData.append("image", imageInput.current.files[0]);
      }

      try {
        const { data } = await axiosReq.post("/medias/", formData);
        console.log("media uploaded: ", data);
        handlePostSubmit(data?.id);
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
    console.log(medias);
    if (medias) formData.append("media", medias);
    if (tags.length) formData.append("tags", tags);
    formData.append("listing_type", listing_type);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      console.log("submitting post data: ", formData);
      await axiosReq.put(`/posts/${id}/`, formData);
      history.push(`/posts/${id}`);
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
        <Form.Label>body</Form.Label>
        <Form.Control
          as="textarea"
          name="body"
          rows={6}
          value={body}
          onChange={handleChange}
          placeholder="Post body here"
        />
      </Form.Group>
      {errors?.body?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Home - latitude</Form.Label>
        <Form.Control
          type="text"
          value={latitude}
          onChange={handleChange}
          name="latitude"
          placeholder="Latitude"
        />
        <Form.Label>Home - longitude</Form.Label>
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
          >
            Get Live Location
          </Button>
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
        save
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
              {media.length || imageInput?.current?.files[0] ? (
                <>
                  <figure>
                    <Image
                      className={appStyles.Image}
                      src={mediaData.image}
                      rounded
                    />
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

export default PostEditForm;
