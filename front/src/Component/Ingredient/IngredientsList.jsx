// import fractionUnicode from "fraction-unicode";
import IngredientItem from "./IngredientItem";
import "./IngredientsList.css";

function Ingredients(props) {
  return (
    <div className="ingredients">
      <ul className="Ingredients-List">
        {props.data.map((ing, index) => (
          <IngredientItem key={index} description={ing} />
        ))}
      </ul>
    </div>
  );
}

export default Ingredients;
