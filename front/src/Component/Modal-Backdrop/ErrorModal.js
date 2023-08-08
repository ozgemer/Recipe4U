import React from "react";

import Modal from "./Modal";
import Button from "../Button/Button";
import "./ErrorModal.css";
const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      className="errorMes"
      footer={
        <Button className="btn" onClick={props.onClear}>
          Okay
        </Button>
      }
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
