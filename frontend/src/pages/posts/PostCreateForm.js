import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Assets from "../../components/Assets";
import { Alert, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

const Upload = <i className="fa-solid fa-cloud-arrow-up"></i>;

function PostCreateForm() {
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
    listing_type: 3,
  });

  const { title, content, image, tags, listing_type } = postData;

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
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

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
    formData.append("content", content);
    if (medias) formData.append("media", medias);
    if (tags) formData.append("tags", tags);
    formData.append("listing_type", listing_type);

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
      <Form.Group controlId="Content">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          name="content"
          rows={6}
          value={content}
          onChange={handleChange}
          placeholder="Post content here"
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
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
            defaultValue={3}
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
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                    <video className={appStyles.Image} src={image} controls />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn btn-primary`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Assets
                    icon={Upload}
                    message="Click or tap to upload an image"
                  />
                </Form.Label>
              )}

              <Form.File
                id="image-upload"
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
