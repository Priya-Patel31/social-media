import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../../assets/images/avatar.jpg";
import { AiOutlineLeft } from "../../assets/icons/icons";
import "./comments.css";
import Post from "../post/Post";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getPostById,
  postComment,
} from "../../features/comments/commentsSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const Comments = () => {
  const { user } = useAppSelector((state) => {
    return state.auth;
  });
  const { postId } = useParams();
  const { post, fetchCommentStatus, isDelete } = useAppSelector((state) => {
    return state.comments;
  });
  const dispatch = useAppDispatch();
  const [input, setInput] = useState<string>("");
  const navigate = useNavigate();
  const ref = useRef(false);
  useEffect(() => {
    async function getComments() {
      try {
        if (isDelete) {
          navigate(-1);
        }
        const res = (await dispatch(getPostById(postId ?? ""))) as any;
        unwrapResult(res);
      } catch (e) {
        toast.error("Failed to fetch comments");
      }
    }
    if (ref.current === false) {
      getComments();
      ref.current = true;
    }

  }, [dispatch, postId, fetchCommentStatus, isDelete, navigate]);

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
          postId: postId ?? "",
        })
      );
      unwrapResult(res);
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
        onClick={() => {
          navigate(-1);
        }}
      >
        <AiOutlineLeft />
        Go Back{" "}
      </button>
      {post !== null && (
        <Post post={post}>
          <div className="comment-container">
            <div className="flex-col mt-2">
              <div className="flex-row">
                <img
                  className="avatar small-avatar"
                  src={Avatar}
                  alt="avatar"
                />
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
              {post?.comments?.map((comment) => {
                return (
                  <div
                    className="comment-wrapper flex-row"
                    key={comment.commentId}
                  >
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
      )}
    </div>
  );
};

export default Comments;
