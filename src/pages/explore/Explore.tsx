import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPosts } from "../../features/explore/exploreSlice";
import Post from "../../shared/post/Post";

export const Explore = () => {
  const dispatch = useAppDispatch();
  const { posts, fetchPostsStatus } = useAppSelector((state) => {
    return state.explore;
  });
  console.log(fetchPostsStatus)
  useEffect(() => {
    if (fetchPostsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, fetchPostsStatus]);

  return (
    <div>
      {posts.map((post) => {
        return <Post key={post.id} post={post}/>;
      })}
    </div>
  );
};
