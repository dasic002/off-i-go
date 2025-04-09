import React from "react";
import styles from "../../styles/Comment.module.css";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Avatar from "../../components/Avatar";

const Comment = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    // post,
    body,
    created_at,
    updated_at,
    is_owner,
    reaction_id,
    reaction_type_id,
    replies,
    reactions_count,
    popular_reactions,
    setComments,
  } = props;

  return (
    <div>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <div className="d-flex align-items-center justify-content-between">
            <span>
              <span className={styles.Owner}>{owner}</span>
              <span className={styles.Date}>{updated_at}</span>
            </span>
            <span className={styles.Edited}>
              {created_at !== updated_at && "Edited"}
            </span>
          </div>
          <p>{body}</p>
        </Media.Body>
      </Media>
    </div>
  );
};

export default Comment;
