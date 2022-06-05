import React from "react";
import CreatePost from "../../shared/createPost/CreatePost";
import Post from "../../shared/post/Post";

const Feeds = () => {
  return (
    <div>
      <CreatePost />
      <Post />
      <Post />
      <Post />
    </div>
  );
};

export default Feeds;
