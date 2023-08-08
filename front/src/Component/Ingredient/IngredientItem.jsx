//FiCheck
import { FiCheck } from "react-icons/fi";
import "./IngredientsItem.css";

function IngredientItem(props) {
  return (
    <li className="recipe__ingredient">
      <FiCheck />
      <div className="ingredient__description">{props.description}</div>
    </li>
  );
}

export default IngredientItem;
