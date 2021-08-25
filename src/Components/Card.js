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
  classNameCardDetails,
  classNameDescription,
  classNameCard,
}) => {
  return (
    <div className={`card ${classNameCard}`}>
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
      <div className={classNameCardDetails}>
        {data.description && (
          <div className="card-description">
            <p className={classNameDescription}>{data.description}</p>
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
