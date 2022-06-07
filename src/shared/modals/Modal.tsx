import React from "react";
import "./modal.css";
import { IoMdClose } from "../../assets/icons/icons";

const Modal = ({ children, className, onClick, show }: any) => {
  // TO-DO
  return show ? (
    <div className={`${className} modal-ctn`} onClick={onClick}>
      <div onClick={(e) => e.stopPropagation()} className="modal-popup-container">
        <button className="close-modal" onClick={onClick}>
          <IoMdClose />
        </button>
        {children}
      </div>
    </div>
  ) : null;
};
<IoMdClose />;
export default Modal;
