import React, { useEffect } from "react";
import CreatePost from "../../shared/createPost/CreatePost";
import Post from "../../shared/post/Post";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchUserPosts } from "../../features/posts/PostsSlice";

const Feeds = () => {
  const dispatch = useAppDispatch();
  const { posts, fetchPostsStatus } = useAppSelector((state) => {
    return state.posts;
  });
  const { user } = useAppSelector((state) => {
    return state.auth;
  });
  useEffect(() => {
    if (fetchPostsStatus === "idle" && user?.following) {
      dispatch(fetchUserPosts(user?.following ?? []));
    }
  }, [dispatch, fetchPostsStatus, user?.following]);

  return (
    <div>
      <CreatePost />
      {posts.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </div>
  );
};

export default Feeds;
