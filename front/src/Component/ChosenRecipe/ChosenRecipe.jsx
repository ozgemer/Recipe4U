import React from "react";
import { useParams } from "react-router-dom";
import Recipe from "../Recipe/Recipe";
import "./ChosenRecipe.css";
import { UseSearch } from "../../Context/Session";
const ChosenRecipe = (props) => {
  const index = useParams().index;
  const [loadedRecipe, setLoadedRecipe] = React.useState();
  const search = UseSearch();
  React.useEffect(() => {
    const setRec = async () => {
      const tempData = await props.items[index];

      if (tempData) {
        sessionStorage.setItem("loadedRecipe", JSON.stringify(tempData));
        setLoadedRecipe(tempData);
      } else {
        setLoadedRecipe(JSON.parse(sessionStorage.getItem("loadedRecipe")));
      }
    };

    setRec();
  }, [index]);

  return (
    <>
      {loadedRecipe && (
        <Recipe
          index={index}
          id={loadedRecipe._id}
          image={loadedRecipe.imageSrc}
          title={loadedRecipe.title}
          time={loadedRecipe.time}
          servings={loadedRecipe.servings}
          ingrediants={loadedRecipe.ingrediants}
          description={loadedRecipe.description}
          publisher={loadedRecipe.publisher}
          userId={loadedRecipe.userNameId}
          identifier={loadedRecipe.identifiers}
          link={loadedRecipe.link}
        />
      )}
      {!loadedRecipe && (
        <div className="chosenRecipe-recipes__container">
          <header className="chosenRecipe-recipes__header">
            ops.. its seems that there is no recipe here...
          </header>
        </div>
      )}
    </>
  );
};
export default ChosenRecipe;
