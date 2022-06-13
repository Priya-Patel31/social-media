import React, {
  SyntheticEvent,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import "./createPost.css";
import Picker, { SKIN_TONE_LIGHT } from "emoji-picker-react";
import Avatar from "../../assets/images/avatar.jpg";
import { editPost, uploadPost } from "../../features/posts/PostsSlice";
import { Post } from "../../features/posts/posts.types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

type CreatePostProps = {
  className?: string;
  caption?: string;
  post?: Post | null;
  update?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>> | null;
  explore?: boolean
};
const CreatePost = ({
  className,
  caption = "",
  post = null,
  update = false,
  setShowModal = null,
  explore 
}: CreatePostProps) => {
  //To-Do
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [input, setInput] = useState<string>(caption);

  const onEmojiClick = (event: SyntheticEvent, emojiObject: any) => {
    setInput(input + emojiObject.emoji);
  };
  const { user } = useAppSelector((state) => {
    return state.auth;
  });
  const { uploadPostStatus } = useAppSelector((state) => {
    return state.posts;
  });

  const dispatch = useAppDispatch();
  const updatePostHandler = async () => {
    if (
      input.length === 0 ||
      uploadPostStatus === "pending" ||
      post?.caption === input
    )
      return;
    if (post !== null && setShowModal !== null) {
      let updatedPost = { ...post, caption: input };
      try {
        const res = await dispatch(editPost({ post: updatedPost,explore }));
        unwrapResult(res);
        toast.success("Post updated successfully !!");
        setInput("");
        setShowModal(false);
      } catch (e) {
        toast.error("Cannot update post");
      }
    }
  };
  const addPostHandler = async () => {
    if (input.length === 0 || uploadPostStatus === "pending") {
      return;
    }
    const postData: Post = {
      caption: input,
      username: user?.username ?? "",
      name: user?.name ?? "",
      date: Date(),
      likes: [],
      comments: [],
      bookmarks: [],
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
              input.length === 0 ||
              uploadPostStatus === "pending" ||
              (update && input === post?.caption)
                ? "disabled-button"
                : "primary-button"
            } button  font-bold`}
            onClick={update ? updatePostHandler : addPostHandler}
          >
            {uploadPostStatus === "pending" ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
