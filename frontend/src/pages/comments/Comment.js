import React, { useState } from "react";
import styles from "../../styles/Comment.module.css";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import CommentEditForm from "./CommentEditForm";
import { axiosRes } from "../../api/axiosDefaults";

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
    // reaction_id,
    // reaction_type_id,
    // replies,
    // reactions_count,
    // popular_reactions,
    setPost,
    setComments,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span>
            <span className={styles.Owner}>{owner}</span>
            <span className={styles.Date}>{updated_at}</span>
          </span>
          <span className={styles.Edited}>
            {created_at !== updated_at && "Edited"}
          </span>
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              body={body}
              profileImage={profile_image}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{body}</p>
          )}
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </div>
  );
};

export default Comment;
