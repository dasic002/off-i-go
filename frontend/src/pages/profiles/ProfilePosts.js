import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData, possessionHelper } from "../../utils/utils";
import Asset from "../../components/Asset";
import Post from "../posts/Post";

const NoResults = <i className="fa-solid fa-ghost"></i>;

const ProfilePosts = (props) => {
  const { profile, profilePosts, setProfilePosts, profileView } = props;
  return (
    <>
      <hr />
      <p className="text-center">
        {possessionHelper(`${profile?.owner}`)} {profileView}
      </p>
      <hr />
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => (
            <Post key={post.id} {...post} setPosts={setProfilePosts} />
          ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => fetchMoreData(profilePosts, setProfilePosts)}
        />
      ) : (
        <Asset icon={NoResults} message="No posts to display" />
      )}
    </>
  );
};

export default ProfilePosts;
