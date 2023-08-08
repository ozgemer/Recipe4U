import React from "react";
import RecipeItem from "../RecipeItem/RecipeItem";

import "./Result.css";
const Result = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="recipe-list center">
        <h3> No recipe found. Maybe create one?</h3>
      </div>
    );
  }
  return (
    <aside>
      <ul className="recipe-list center">
        {props.items.length > 0 ? (
          props.items.map((recipe, index) => {
            return (
              <RecipeItem
                key={index}
                index={index}
                id={recipe.id}
                imageSrc={recipe.imageSrc}
                title={recipe.title}
                time={recipe.time}
                servings={recipe.servings}
                ingrediants={recipe.ingrediants}
                description={recipe.description}
                publisher={recipe.publisher}
                link={recipe.link}
                address={recipe.address}
                coordinates={recipe.location}
                onDelete={props.onDeleteRecipe}
              />
            );
          })
        ) : (
          <></>
        )}
      </ul>
    </aside>
  );
};

export default Result;
