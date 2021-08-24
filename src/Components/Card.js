import "./Card.css";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = ({
  data,
  handleCreateBookmark,
  index,
  dispayBookmarkIcon,
  dispayMoreButton,
  titleKey,
  classNameTitle,
  classNameCallToAction,
}) => {
  return (
    <div className="card">
      <div
        className={`card-title ${classNameTitle}`}
        style={{
          backgroundColor: index % 3 === 1 ? "#f60c02" : "#555c66",
        }}
      >
        <p>{data[titleKey]}</p>
      </div>
      <div className="card-image">
        <img
          src={`${data.thumbnail.path}.${data.thumbnail.extension}`}
          alt={data[titleKey]}
        />
      </div>
      <div className="card-details">
        {data.description && (
          <div className="card-description">
            <p>{data.description}</p>
          </div>
        )}
        <div className={`card-call-to-action ${classNameCallToAction}`}>
          {dispayBookmarkIcon && (
            <button
              className="button-with-red-border"
              id="submit-btn"
              onClick={() =>
                handleCreateBookmark(
                  data[titleKey],
                  data.description,
                  data.thumbnail
                )
              }
            >
              <FontAwesomeIcon icon="bookmark" />
            </button>
          )}
          {dispayMoreButton && (
            <Link to={`/character/${data._id}`}>
              <button className="button-filled-with-red">En savoir plus</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
