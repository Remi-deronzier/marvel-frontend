import { useEffect, useState } from "react";

import "./HomePage.css";

import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as qs from "qs";
import Modal from "react-modal";
import Cookies from "js-cookie";
import { useDebounce } from "use-debounce";
import ReactPaginate from "react-paginate";

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
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [skip, setskip] = useState(0);

  const [debouncedSearch] = useDebounce(search, 1000);

  let history = useHistory();

  const location = useLocation();
  const params = qs.parse(location.search.slice(1));
  const onboarding = params.onboarding;

  const pageCount = Math.ceil(data.count / limit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingResults(true);
        const queryParams = qs.stringify({
          name: debouncedSearch,
          limit: limit,
          skip: skip,
        });
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/characters?${queryParams}`
        );
        setData(response.data);
        setIsLoadingHomePage(false);
        setIsLoadingResults(false);
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
    document.title = "Marvel App Rémi";
  }, [debouncedSearch, limit, skip]);

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

  // WELCOME MODAL

  const handleWelcomeModalClose = () => {
    setIsWelcomeModalOpen(false);
  };

  const handleAfterOpenWelcomeModal = () => {
    setTimeout(() => {
      setIsWelcomeModalOpen(false);
    }, 7000);
  };

  // SEARCH BAR

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // PAGINATION

  const handlePageClick = (data) => {
    const selected = data.selected;
    setskip(limit * selected);
  };

  const handleChangeSelect = (e) => {
    setLimit(e.target.value);
  };

  return isLoadingHomePage ? (
    <p>En cours de chargement...</p>
  ) : (
    <>
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
      </Modal>{" "}
      {isLoadingResults ? (
        <p>Chargement des résultats...</p>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Rechercher des personnages de BD"
            onChange={handleChangeSearch}
            value={search}
          />
          <br />
          <label>
            Nombre de résultats à afficher :
            <select
              value={limit}
              onChange={handleChangeSelect}
              className="select-page-nb-display"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
          {data.count === 0 ? (
            <p>Aucun résultat trouvé 😥 !!!</p>
          ) : (
            data.results.map((character, index) => {
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
            })
          )}
        </div>
      )}{" "}
      {data.count !== 0 && (
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page"}
          previousClassName={"previous-page"}
          nextClassName={"next-page"}
          disabledClassName={"disabled-previous-and-next-label"}
        />
      )}
    </>
  );
};

export default HomePage;
