import React, { SyntheticEvent, useState, useRef } from "react";
import "./createPost.css";
import Picker, { SKIN_TONE_LIGHT } from "emoji-picker-react";
import Avatar from "../../assets/images/avatar.jpg";
import { uploadPost } from "../../features/posts/PostsSlice";
import { Post } from "../../features/posts/posts.type";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const CreatePost = ({ className }: any) => {
  //To-Do
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const onEmojiClick = (event: SyntheticEvent, emojiObject: any) => {
    setInput(input + emojiObject.emoji);
  };
  const { user } = useAppSelector((state) => {
    return state.auth;
  });
  const { uploadPostStatus ,posts} = useAppSelector((state) => {
    return state.posts;
  });
  const dispatch = useAppDispatch();
  const createPostHandler = async () => {
    if(input.length === 0 || uploadPostStatus === "pending"){
      return 
    }
    const postData: Post = {
      caption: input,
      username: user?.username ?? "",
      name: user?.name ?? "",
      date: Date(),
      likes: [],
      comments: [],
      bookmark: false,
    };
    try {
      const res = await dispatch(uploadPost(postData));
      unwrapResult(res);
      toast.success("Posted successfully !!");
      setInput("");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };
  const ref = useRef<null | any>(null);
  function onInput() {
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }
  return (
    <div className={`create-post-container flex-row ${className}`}>
      <div className="flex-col justify-between emoji-picker-icon-wrapper">
        <img src={Avatar} alt="profile" className="avatar small-avatar" />
        <button
          className="emoji-picker-icon"
          onClick={() => {
            setShowEmoji(!showEmoji);
          }}
        >
          😃
        </button>
        {showEmoji && (
          <div className="emoji-picker-wrapper">
            <Picker onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_LIGHT} />
          </div>
        )}
      </div>
      <div className="flex-col textarea-wrapper">
        <textarea
          ref={ref}
          onInput={onInput}
          className="create-post-text"
          placeholder="What's happening?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="post-btn-wrapper flex-row align-center">
          <span
            className={`${
              input.length > 250 ? "color-red" : ""
            }  flex-row align-center mr-2 char-count`}
          >
            {250 - input.length}
          </span>
          <button
            disabled={input.length === 0 || uploadPostStatus === "pending"}
            className={`${
              (input.length === 0 || uploadPostStatus === "pending")
                ? "disabled-button"
                : "primary-button"
            } button  font-bold`}
            onClick={createPostHandler}
          >
          {uploadPostStatus === "pending" ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
