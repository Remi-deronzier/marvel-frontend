import "./Card.css";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = ({ character, handleCreateBookmark, index }) => {
  return (
    <div className="card">
      <div
        className="card-title"
        style={{
          backgroundColor: index % 3 === 1 ? "#f60c02" : "#555c66",
        }}
      >
        <p>{character.name}</p>
      </div>
      <div className="card-image">
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt={character.name}
        />
      </div>
      <div className="card-details">
        {character.description && (
          <div className="card-description">
            <p>{character.description}</p>
          </div>
        )}
        <div className="card-call-to-action">
          <button
            className="button-with-red-border"
            id="submit-btn"
            onClick={() =>
              handleCreateBookmark(
                character.name,
                character.description,
                character.thumbnail
              )
            }
          >
            <FontAwesomeIcon icon="bookmark" />
          </button>
          <Link to={`/character/${character._id}`}>
            <button className="button-filled-with-red">En savoir plus</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
