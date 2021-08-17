import { useEffect, useState } from "react";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";

const ComicsPage = ({
  token,
  bookmarkName,
  handleNewBookmark,
  isBookmarkAddedModalOpen,
  handleAfterOpenBookmarkModal,
  handleBookmarkAddedModalClose,
}) => {
  const [comics, setComics] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/comics`
        );
        setComics(response.data);
        setIsLoading(false);
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
    document.title = "Marvel Comics";
  }, []);

  // BOOKMARKS

  const handleCreateBookmark = async (title, description, thumbnail) => {
    if (token) {
      await handleNewBookmark(title, description, thumbnail);
    } else {
      history.push("/login");
    }
  };

  return isLoading ? (
    <p>En cours de chargement...</p>
  ) : (
    <div>
      <Modal
        isOpen={isBookmarkAddedModalOpen}
        onRequestClose={handleBookmarkAddedModalClose}
        onAfterOpen={handleAfterOpenBookmarkModal}
        ariaHideApp={false}
      >
        Ton marque-page <u>{bookmarkName}</u> a bien été ajouté à tes favoris
        !!!
      </Modal>
      {comics.results.map((comic, index) => {
        return (
          <div key={index}>
            <img
              src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
              alt={comic.title}
            />
            <p>{comic.title}</p>
            <p>{comic.description}</p>
            <button
              id="submit-btn"
              onClick={() =>
                handleCreateBookmark(
                  comic.title,
                  comic.description,
                  comic.thumbnail
                )
              }
            >
              <FontAwesomeIcon icon="bookmark" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ComicsPage;
