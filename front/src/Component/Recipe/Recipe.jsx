import React, { useState, useEffect } from "react";
import { BiTimeFive } from "react-icons/bi";
import Modal from "../Modal-Backdrop/Modal";
import Ingredients from "../Ingredient/IngredientsList";
import Button from "../Button/Button";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { UseSession, UseSearch } from "../../Context/Session";
import "./Recipe.css";
import EditRecipe from "./EditRecipe";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { BookmarkButton } from "./BookmarkButton";

function Recipe(props) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const session = UseSession();
  const setResult = UseSearch().setResult;
  const result = UseSearch().result;
  const showDeleteHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:3000/recipe/delete/${props.id}`,
        "DELETE"
      );
    } catch (err) {}
    const searchResults = result.filter(
      (e) => session.session.bookmarks.indexOf(`${props.id}`) > -1
    );
    setResult(searchResults);
  };
  const editHandler = () => setEditMode((prev) => !prev);
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
      <div className="recipe">
        <div className="recipe__header">
          <img className="recipe__image" alt=" " src={props.image} />
          <h1>
            <span className="recipe__title">{props.title}</span>
          </h1>
        </div>
        <div className="bottons">
          {session.session.userId !== null && (
            <>
              {session.session.userId == props.userId && (
                <>
                  <Button onClick={editHandler} className="btn btn--edit">
                    EDIT
                  </Button>
                  <Button onClick={showDeleteHandler} className="btn btn--del">
                    DELETE
                  </Button>
                </>
              )}
              <BookmarkButton
                selected={session.session.bookmarks.indexOf(`${props.id}`) > -1}
                id={props.id}
              ></BookmarkButton>
            </>
          )}
        </div>
        {editMode ? (
          <EditRecipe {...props} exitEditMode={editHandler} />
        ) : (
          <ShowRecipe {...props} />
        )}
      </div>
    </>
  );
}

function ShowRecipe(props) {
  return (
    <>
      <div className="recipe__details">
        <div className="recipe__info">
          <span className="recipe__info-text">Preparation Time: </span>
          <span className="recipe__info-data">
            {`${props.time} minutes`}
            <div>
              {"\u00A0"} {"\u00A0"}
            </div>
            <BiTimeFive />
          </span>
        </div>
        <div className="recipe__info">
          <span className="recipe__info-text">The recipe is for: </span>
          <span className="recipe__info-data">
            {`${props.servings} servings `}
            <div>
              {" "}
              {"\u00A0"} {"\u00A0"}
            </div>
            <PeopleAltIcon />
          </span>
        </div>
        <div className="recipe__info">
          <span className="recipe__info-text">publisher:</span>
          <span className="recipe__info-data">
            {props.publisher}
            <div>
              {" "}
              {"\u00A0"} {"\u00A0"}
            </div>
            <BorderColorIcon />
          </span>
        </div>
      </div>
      <div className="recipe__flex">
        <div className="recipe__ingredients">
          <h2 className="heading--2">Recipe ingredients</h2>
          <Ingredients data={props.ingrediants} />
        </div>
        <div className="recipe__directions">
          <h2 className="heading--2">How to cook it</h2>
          <div className="recipe__description">
            <p>{props.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Recipe;
