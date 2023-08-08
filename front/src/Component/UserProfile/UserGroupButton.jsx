import React, { useState } from "react";
import Button from "../Button/Button";
import Modal from "../Modal-Backdrop/Modal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { UseSession } from "../../Context/Session";

import { Link } from "react-router-dom";
import "./UserGroupButton.css";

function UserGroupButton({ changePass }) {
  const [buttonList, setButtonList] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const session = UseSession();
  const buttonListToggle = () => setButtonList(!buttonList);
  const showDeleteHandler = () => setShowConfirmModal(true);
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:3000/users/delete/${session.session.userId}`,
        "DELETE"
      );
      setShowConfirmModal(false);
    } catch (err) {}
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="recipe__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={cancelDeleteHandler} className="btn btn--cancel">
              CANCEL
            </Button>
            <Button onClick={confirmDeleteHandler} className="btn">
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this recipe? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <div className="right">
        <Button className="btn button-dots" onClick={buttonListToggle}>
          <img
            src="https://img.icons8.com/fluency-systems-filled/48/000000/drag-list-down.png"
            width={35}
          />
        </Button>
        <div className="buttons-popup">
          {buttonList && (
            <ButtonGroup
              deletebtn={showDeleteHandler}
              changePass={changePass}
              toggle={() => setButtonList((prev) => !prev)}
            />
          )}
        </div>
      </div>
    </>
  );
}

function ButtonGroup(props) {
  return (
    <div className="button-group" onMouseLeave={props.toggle}>
      <Button className="btn user-button" onClick={props.changePass}>
        change password
      </Button>
      <Button onClick={props.deletebtn} className="btn user-button">
        delete account
      </Button>
    </div>
  );
}

export default UserGroupButton;
