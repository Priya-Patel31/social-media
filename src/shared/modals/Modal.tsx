import React from "react";
import "./modal.css";

const Modal = ({ children, className, onClick, show }: any) => {// TO-DO
  return show ? (
    <div className={`${className} modal-ctn`} onClick={onClick}>
      <div onClick={(e) => e.stopPropagation()} className="modal-popup-container">

        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;
