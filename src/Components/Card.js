import "./Card.css";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";

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
  displayBookmarkName,
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
      <div
        className="card-image"
        style={{ position: displayBookmarkName && "relative" }}
      >
        {displayBookmarkName && (
          <div
            className="card-bookmark-name"
            style={{
              backgroundColor:
                index % 3 === 1
                  ? "rgb(246, 12, 2, 0.6)"
                  : "rgb(85, 92, 102,0.8)",
            }}
          >
            <p>{data.name}</p>
          </div>
        )}
        <img
          src={
            data.thumbnail
              ? `${data.thumbnail.path}.${data.thumbnail.extension}`
              : `${data.thumbnail_path}.${data.thumbnail_extension}`
          }
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
            <>
              <button
                data-tip="Clique sur l'icône pour ajouter cette carte à tes favoris"
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
              <ReactTooltip
                place="bottom"
                type="dark"
                effect="solid"
                className="tooltip"
              />
            </>
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
