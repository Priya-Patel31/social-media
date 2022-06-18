import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../../assets/images/avatar.jpg";
import { Comment, Post as PostType } from "../../features/posts/posts.types";
import { AiOutlineLeft } from "../../assets/icons/icons";
import "./comments.css";
import Post from "../post/Post";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getCommentsByPostId,
  postComment,
} from "../../features/posts/PostsSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const Comments = () => {
  const { post }: { post: PostType } = useLocation().state as {
    post: PostType;
  };
  const { user } = useAppSelector((state) => {
    return state.auth;
  });
  const dispatch = useAppDispatch();
  const [input, setInput] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>(post?.comments ?? []);
  const navigate = useNavigate();
  useEffect(() => {
    async function getComments() {
      try {
        const res = (await dispatch(getCommentsByPostId(post.id ?? ""))) as any;
        unwrapResult(res);
        setComments(res.payload.comments);
      } catch (e) {
        toast.error("Failed to fetch comments");
      }
    }
    if (post.id) {
      getComments();
    }
  }, [dispatch, post.id]);
  const handleReply = async () => {
    try {
      const uid = localStorage.getItem("uid");
      const comment = {
        comment: input,
        commentId: Date.now().toString(),
        uid: uid ?? "",
        username: user?.username ?? "",
        replies: [],
        imageUrl: user?.imageUrl ?? "",
      };
      const res = await dispatch(
        postComment({
          comment,
          postId: post.id ?? "",
        })
      );
      unwrapResult(res);
      setComments([comment, ...comments]);
      setInput("");
      toast.success("Comment posted successfully !!");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div>
      <button
        className="button primary-button go-back-btn"
        onClick={() => navigate(-1)}
      >
        <AiOutlineLeft />
        Go Back{" "}
      </button>
      <Post post={{ ...post, comments }}>
        <div className="comment-container">
          <div className="flex-col mt-2">
            <div className="flex-row">
              <img className="avatar small-avatar" src={Avatar} alt="avatar" />
              <div className="flex-col input-text-wrapper">
                <input
                  className="text-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
                  placeholder="Enter your reply"
                />
                <div>
                  <button
                    className="button primary-button reply-btn"
                    onClick={handleReply}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
            {comments?.map((comment) => {
              return (
                <div className="comment-wrapper flex-row">
                  <div>
                    <img
                      src={Avatar}
                      className="avatar small-avatar"
                      alt="avatar"
                    />
                  </div>
                  <div className="flex-col">
                    <h3>{comment.username}</h3>
                    <p className="mt-1">{comment.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Post>
    </div>
  );
};

export default Comments;
