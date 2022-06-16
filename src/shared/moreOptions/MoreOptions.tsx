import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Post } from "../../features/posts/posts.types";
import { deletePost } from "../../features/posts/PostsSlice";
import CreatePost from "../createPost/CreatePost";
import Modal from "../modals/Modal";
import "./moreOptions.css";

type MoreOptionsProps = {
  post: Post;
};

const MoreOptions = ({ post }: MoreOptionsProps) => {
  const dispatch = useAppDispatch();
  const editHandler = () => {
    setShowModal(!showModal);
  };
  const deletePostHandler = () => {
    dispatch(deletePost({postId: post.id ?? ""}));

  };
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="moreOptions-container">
      {showModal && (
        <Modal show={showModal} onClick={() => setShowModal(false)}>
          <CreatePost
            className="responsive-create-post"
            caption={post.caption}
            post={post}
            update={true}
            setShowModal={setShowModal}
          />
        </Modal>
      )}
      <ul className="list-style-none moreOptions">
        <li
          className="moreOptions-list-item moreOptions-border font-medium"
          onClick={editHandler}
        >
          Edit
        </li>
        <li
          className="moreOptions-list-item font-medium"
          onClick={deletePostHandler}
        >
          Delete
        </li>
      </ul>
    </div>
  );
};

export default MoreOptions;
