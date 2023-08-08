import React, { useState } from "react";
import { Link } from "react-router-dom";
import Map from "../Map/Map";
import Card from "../Card/Card";
import Modal from "../Modal-Backdrop/Modal";
import Image from "../../Images/Image";
import Button from "../Button/Button";
import { FaMapMarkerAlt as MapImage } from "react-icons/fa";

import "./RecipeItem.css";
const RecipeItem = (props) => {
  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);
  return (
    <React.Fragment>
      <Modal
        className="modal-map"
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="recipe-item__modal-content modal-map"
        footerClass="recipe-item__modal-actions"
        footer={
          <Button className="btn btn--blue-close" onClick={closeMapHandler}>
            CLOSE
          </Button>
        }
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <li className="recipe-item">
        <Card className="recipe-item__content">
          <Link to={`/recipe/${props.index}`}>
            <div className="recipe-item__publisher-image">
              <Image image={props.imageSrc} alt={props.title} />
            </div>
            <div className="recipe-item__recipe-info">
              <h2>{props.title}</h2>
              <div className="recipe-item-row">
                <h4 className="recipe-item__publisher">
                  {`Preparation time:${"\u00A0"} ${props.time} Min`}
                </h4>
                <Button className="btn-map" onClick={openMapHandler}>
                  <MapImage />
                </Button>
              </div>
            </div>
          </Link>
        </Card>
      </li>
    </React.Fragment>
  );
};
export default RecipeItem;
