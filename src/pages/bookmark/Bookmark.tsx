import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPosts } from "../../features/bookmark/bookmarkSlice";
import Post from "../../shared/post/Post";

export const Bookmark = () => {
  const dispatch = useAppDispatch();
  const { posts, bookmarkFetchPostsStatus } = useAppSelector((state) => {
    return state.bookmark;
  });
  const { user } = useAppSelector((state) => {
    return state.auth;
  });
  useEffect(() => {
    if (bookmarkFetchPostsStatus === "idle" && user?.bookmarks) {
      dispatch(fetchPosts(user?.bookmarks ?? []));
    }
  }, [dispatch, bookmarkFetchPostsStatus, user?.bookmarks]);

  return (
    <div>
      {posts.length === 0 && (
        <div className="empty-posts">You don't have any posts bookmarked!</div>
      )}
      {posts.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
    </div>
  );
};
