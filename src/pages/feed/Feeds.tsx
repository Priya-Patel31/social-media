import React, { useEffect } from "react";
import { IoMdCheckmarkCircleOutline } from "../../assets/icons/icons";
import CreatePost from "../../shared/createPost/CreatePost";
import Post from "../../shared/post/Post";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchUserPosts } from "../../features/posts/PostsSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { PulseLoader } from "react-spinners";

const Feeds = () => {
  const dispatch = useAppDispatch();
  const { posts, fetchPostsStatus, hasMore } = useAppSelector((state) => {
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
      {posts.length === 0 && fetchPostsStatus === "succeded" && (
        <div className="empty-posts mt-2">Follow users to see posts here!</div>
      )}
      <InfiniteScroll
        dataLength={posts.length}
        next={() => dispatch(fetchUserPosts(user?.following ?? []))}
        hasMore={hasMore}
        loader={
          <div className="loader-wrapper">
            <PulseLoader color="#007aff" loading={true} size="20" />
          </div>
        }
        endMessage={
          <p style={{ textAlign: "center" }} className="end-message-wrapper">
            <div className="flex-row icon-ctn">
              <hr className="line line1" />
              <IoMdCheckmarkCircleOutline className="circle-icon" />
              <hr className="line line2" />
            </div>
            <b className="end-message">You're All Caught Up</b>
            <h5 className="seen-posts">You have seen all the posts</h5>
          </p>
        }
      >
        {posts.map((post) => {
          return <Post post={post} key={post.id} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Feeds;
