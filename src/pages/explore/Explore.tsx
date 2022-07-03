import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PulseLoader } from "react-spinners";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPosts } from "../../features/explore/exploreSlice";
import {IoMdCheckmarkCircleOutline} from "../../assets/icons/icons"
import Post from "../../shared/post/Post";

export const Explore = () => {
  const dispatch = useAppDispatch();
  const { posts, fetchPostsStatus,hasMore } = useAppSelector((state) => {
    return state.explore;
  });
  useEffect(() => {
    if (fetchPostsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, fetchPostsStatus]);

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length}
        next={() => dispatch(fetchPosts())}
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
