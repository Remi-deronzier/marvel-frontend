import { useEffect, useState } from "react";

import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as qs from "qs";
import Modal from "react-modal";
import Cookies from "js-cookie";

const HomePage = ({
  token,
  bookmarkName,
  handleNewBookmark,
  isBookmarkAddedModalOpen,
  handleAfterOpenBookmarkModal,
  handleBookmarkAddedModalClose,
}) => {
  const [data, setData] = useState({});
  const [isLoadingHomePage, setIsLoadingHomePage] = useState(true);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  let history = useHistory();

  const location = useLocation();
  const params = qs.parse(location.search.slice(1));

  const onboarding = params.onboarding;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/characters`
        );
        setData(response.data);
        setIsLoadingHomePage(false);
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
    document.title = "Marvel App Rémi";
  }, []);

  useEffect(() => {
    if (onboarding) {
      setIsWelcomeModalOpen(true); // trigger a welcome modal when the user sign up for the first time
    }
  }, [onboarding]);

  // BOOKMARKS

  const handleCreateBookmark = async (title, description, thumbnail) => {
    if (token) {
      await handleNewBookmark(title, description, thumbnail);
    } else {
      history.push("/login");
    }
  };

  // MODALs

  const handleWelcomeModalClose = () => {
    setIsWelcomeModalOpen(false);
  };

  const handleAfterOpenWelcomeModal = () => {
    setTimeout(() => {
      setIsWelcomeModalOpen(false);
    }, 7000);
  };

  return isLoadingHomePage ? (
    <p>En cours de chargement...</p>
  ) : (
    <div>
      <Modal
        isOpen={isWelcomeModalOpen}
        onRequestClose={handleWelcomeModalClose}
        onAfterOpen={handleAfterOpenWelcomeModal}
        ariaHideApp={false}
      >
        Bonjour <u>{Cookies.get("username")}</u>, bienvenue sur la meilleure API
        de MARVEL ! 🎉
      </Modal>
      <Modal
        isOpen={isBookmarkAddedModalOpen}
        onRequestClose={handleBookmarkAddedModalClose}
        onAfterOpen={handleAfterOpenBookmarkModal}
        ariaHideApp={false}
      >
        Ton marque-page <u>{bookmarkName}</u> a bien été ajouté à tes favoris
        !!!
      </Modal>
      {data.results.map((character, index) => {
        return (
          <div key={index}>
            <Link to={`/character/${character._id}`}>
              <img
                src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                alt={character.name}
              />
              <p>{character.name}</p>
              <p>{character.description}</p>
            </Link>
            <button
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
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
