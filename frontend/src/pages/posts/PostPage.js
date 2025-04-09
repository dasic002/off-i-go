import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Post from "./Post";
import Asset from "../../components/Asset";
import CommentCreateForm from "../comments/CommentCreateForm";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

const NoResults = <i className="fa-solid fa-ghost"></i>;
const message = "Post not found";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosReq.get(`/posts/${id}/`),
          axiosReq.get(`/comments/?post=${id}`),
        ]);
        setPost({ results: [post] });
        setHasLoaded(true);
        setComments(comments);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        {hasLoaded ? (
          post.results.length ? (
            <>
              <Post {...post.results[0]} setPosts={setPost} postPage />
              <Container className={appStyles.Content}>
                {currentUser ? (
                  <CommentCreateForm
                    profile_id={currentUser.profile_id}
                    profileImage={profile_image}
                    post={id}
                    setPost={setPost}
                    setComments={setComments}
                  />
                ) : comments.results.length ? (
                  "Comments"
                ) : null}

                {comments.results.length ? (
                  <InfiniteScroll
                    children={comments.results.map((comment) => (
                      <Comment
                        key={comment.id}
                        {...comment}
                        setPost={setPost}
                        setComments={setComments}
                      />
                    ))}
                    dataLength={comments.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!comments.next}
                    next={() => fetchMoreData(comments, setComments)}
                  />
                ) : currentUser ? (
                  <span>No comments yet, be the first to comment!</span>
                ) : (
                  <span>Please log in to comment</span>
                )}
              </Container>
            </>
          ) : (
            <Container className={appStyles.Content}>
              <Asset icon={NoResults} message={message} />
            </Container>
          )
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;
