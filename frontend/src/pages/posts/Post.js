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
import PopularReactions from "../../components/PopularReactions";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Post = (props) => {
  const {
    content_type,
    id,
    owner,
    profile_id,
    profile_image,
    title,
    body,
    // media,
    // listing_type,
    // original_post,
    // created_at,
    updated_at,
    reaction_id,
    reaction_type_id,
    // reaction_type,
    reactions_count,
    comments_count,
    popular_reactions,
    // tags,
    // tagged_interest,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReaction = async () => {
    try {
      const { data } = await axiosRes.post("/reactions/", {
        content_type: content_type,
        object_id: id,
        reaction: 0,
      });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? {
                ...post,
                reactions_count: post.reactions_count + 1,
                reaction_id: data.id,
                reaction_type_id: data.reaction,

                popular_reactions: post.popular_reactions.map(
                  (item, index) => {
                    return item.reaction === reaction_type_id &&
                      reaction_type_id !== null &&
                      item.count > 0
                      ? {
                          count: item.count + 1,
                        }
                      : index === post.popular_reactions.length - 1
                      ? (popular_reactions[popular_reactions.length] = {
                          reaction: data.reaction,
                          count: 1,
                        })
                      : item;
                  },
                  post.popular_reactions.length
                    ? null
                    : (popular_reactions[post.popular_reactions.length] = {})
                ),
              }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleNoReaction = async () => {
    try {
      await axiosRes.delete(`/reactions/${reaction_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? {
                ...post,
                reactions_count: post.reactions_count - 1,
                reaction_id: null,
                reaction_type_id: null,

                popular_reactions: post.popular_reactions.map((item, index) => {
                  return item.reaction === reaction_type_id && item.count > 1
                    ? {
                        count: item.count - 1,
                      }
                    : item.reaction === reaction_type_id && item.count === 1
                    ? post.popular_reactions.pop(index)
                    : item;
                }),
              }
            : post;
        }),
      }));
    } catch (err) {}
  };

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
            {is_owner && postPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        media
        {/* <Card.Img src={media} alt={title} /> */}
      </Link>
      <Card.Body>
        <Row className="justify-content-between">
          <Col xs={2}>
            <PopularReactions
              popular_reactions={popular_reactions}
              count={reactions_count}
            />
          </Col>
          <Col xs={8}>
            {title && <Card.Title className="text-center">{title}</Card.Title>}
          </Col>
          <Col xs={2}>
            <Link to={`/posts/${id}`}>
              <i className="far fa-comment" />
            </Link>
            <div>{comments_count}</div>
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
            <span onClick={handleNoReaction}>
              <i className={`fa-solid fa-thumbs-up ${styles.Reaction}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleReaction}>
              <i
                className={`fa-regular fa-thumbs-up ${styles.ReactionOutline}`}
              />
            </span>
          ) : (
            // <Dropdown as={ButtonGroup}>
            //   <Dropdown.Toggle variant="success" id="dropdown-split-basic">
            //     <i
            //       className={`fa-regular fa-thumbs-up ${styles.ReactionOutline}`}
            //     />
            //   </Dropdown.Toggle>

            //   <Dropdown.Menu>
            //     <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            //     <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            //     <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            //   </Dropdown.Menu>
            // </Dropdown>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You need to login to react!</Tooltip>}
            >
              <i
                className={`fa-regular fa-thumbs-up ${styles.ReactionOutline}`}
              />
            </OverlayTrigger>
          )}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comment" />
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
