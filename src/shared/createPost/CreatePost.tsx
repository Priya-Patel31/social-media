import React, { SyntheticEvent, useState, useRef } from "react";
import "./createPost.css";
import Picker, { SKIN_TONE_LIGHT } from "emoji-picker-react";
import Avatar from "../../assets/images/avatar.jpg";

const CreatePost = ({className }:any) => { //To-Do
  const [showEmoji, setShowEmoji] = useState(false);
  const [input, setInput] = useState("");

  const onEmojiClick = (event: SyntheticEvent, emojiObject: any) => {

    setInput(input + emojiObject.emoji)
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
            disabled={input.length === 0 && true}
            className={`${
              input.length === 0 ? "disabled-button" : "primary-button"
            } button  font-bold`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
