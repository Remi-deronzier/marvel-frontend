import { useEffect, useState } from "react";

import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as qs from "qs";
import Modal from "react-modal";
import Cookies from "js-cookie";

const HomePage = ({
  isConnected,
  handleSubmissionDesactivation,
  handleSubmissionActivation,
}) => {
  const [data, setData] = useState({});
  const [isLoadingHomePage, setIsLoadingHomePage] = useState(true);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

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
      setIsWelcomeModalOpen(true);
    }
  }, [onboarding]); // trigger a welcome modal when the user sign up for the first time

  // BOOKMARKS

  const handleCreateBookmark = async (title, description, thumbnail) => {
    const name = prompt("Name");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    console.log(formData);
    try {
      handleSubmissionActivation();
      await axios.post(
        "https://marvel-api-remi.herokuapp.com/bookmarks/create",
        formData,
        {
          headers: {
            Authorization: "Bearer " + isConnected,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleSubmissionDesactivation();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // WELCOME MODAL

  const handleWelcomeModalClose = () => {
    setIsWelcomeModalOpen(false);
  };

  const handleAfterOpenFunc = () => {
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
        onAfterOpen={handleAfterOpenFunc}
        ariaHideApp={false}
      >
        Bonjour <span>{Cookies.get("username")}</span>, bienvenue sur la
        meilleure API de MARVEL ! 🎉
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
            <FontAwesomeIcon
              icon="bookmark"
              id="submit-btn"
              onClick={() =>
                handleCreateBookmark(
                  character.name,
                  character.description,
                  character.thumbnail
                )
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
