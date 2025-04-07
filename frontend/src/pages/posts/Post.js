import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import {
  Card,
  Col,
  Media,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Avatar from "../../components/Avatar";
// import PopularReactions from "../../components/PopularReactions";

const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    title,
    body,
    media,
    listing_type,
    original_post,
    created_at,
    updated_at,
    reaction_id,
    reaction_type_id,
    reaction_type,
    reactions_count,
    comments_count,
    popular_reactions,
    tags,
    tagged_interest,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-item-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && postPage && "..."}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img src={media} alt={title} />
      </Link>
      <Card.Body>
        <Row className="justify-content-between">
          <Col sm={2}>
            {/* <PopularReactions
              popular_reactions={popular_reactions}
              count={reactions_count}
            /> */}
          </Col>
          <Col sm={8}>
            {title && <Card.Title className="text-center">{title}</Card.Title>}
          </Col>
          <Col sm={2}>
            <Link to={`/posts/${id}`}>
              <i className="far fa-comment" />
            </Link>
            {comments_count}
          </Col>
        </Row>

        {body && <Card.Text>{body}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You cannot react to your own Post!</Tooltip>}
            >
              <i className="fa-regular fa-thumbs-up"></i>
            </OverlayTrigger>
          ) : reaction_id ? (
            <span onClick={() => {}}>
              <i className={`fa-solid fa-thumbs-up ${styles.Reaction}`} />
            </span>
          ) : currentUser ? (
            <i className={`fa-regular fa-thumbs-up ${styles.ReactionOutline}`} />
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You need to login to react!</Tooltip>}
            >
              <i className={`fa-regular fa-thumbs-up ${styles.ReactionOutline}`} />
            </OverlayTrigger>
          )}
          {reactions_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comment" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
