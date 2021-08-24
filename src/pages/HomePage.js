import { useEffect, useState } from "react";

import Card from "../Components/Card";

import "./HomePage.css";

import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import * as qs from "qs";
import Modal from "react-modal";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";
import Autosuggest from "react-autosuggest";

const HomePage = ({
  token,
  bookmarkName,
  handleNewBookmark,
  isBookmarkAddedModalOpen,
  handleAfterOpenBookmarkModal,
  handleBookmarkAddedModalClose,
  inputProps,
  renderSuggestion,
  getSuggestionValue,
  onSuggestionsClearRequested,
  onSuggestionsFetchRequested,
  suggestions,
  searchAutosuggest,
  debouncedSearch,
}) => {
  const [data, setData] = useState({}); // data which is updated each time a research is made
  const [isLoadingHomePage, setIsLoadingHomePage] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [limit, setLimit] = useState(100);
  const [skip, setskip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [forcePage, setForcePage] = useState(0); // to override selected page when a user is on a high number page and change the limit or make a research. Thus, this state enables to prevent from rendering a blank page !!!

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
          currentPage: currentPage,
        });
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/characters?${queryParams}`
        );
        setForcePage(Number(response.data.currentPage));
        setData(response.data);
        setIsLoadingHomePage(false);
        setIsLoadingResults(false);
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
  }, [debouncedSearch, limit, skip, currentPage]);

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

  // PAGINATION

  const handlePageClick = (data) => {
    const selected = data.selected;
    setCurrentPage(selected);
    setskip(limit * selected);
  };

  const handleChangeSelect = (e) => {
    setLimit(e.target.value);
  };

  // MANAGE SEARCH BAR STYLE ACCORDING TO SCROLL

  window.addEventListener("scroll", () => {
    let scroll = window.scrollY; // Axe Y
    const elem = [...document.querySelectorAll(".react-autosuggest__input")][1]; // select the second search bar (not the first search bar in the header)
    if (scroll < 100) {
      elem.style.width = "calc(100% - 2rem)";
    } else {
      elem.style.width = "25%";
    }
  });

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
      <div className="container main-content-wrapper">
        <h2>Recherche ton super-héros préféré</h2>
        <div className="search-bar-page">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
        <div className="pagination-top">
          <p>{data.count} résultats</p>
          <label>
            Nombre de résultats à afficher :
            <select
              className="select-limit"
              value={limit}
              onChange={handleChangeSelect}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
        {isLoadingResults ? (
          <p>Chargement des résultats...</p>
        ) : (
          <div className="main-content">
            {data.count === 0 ? (
              <div className="no-results">
                <p className="p-no-results">Aucun résultat trouvé 😥 !!!</p>
              </div>
            ) : (
              data.results.map((character, index) => {
                return (
                  <Card
                    index={index}
                    key={index}
                    character={character}
                    handleCreateBookmark={handleCreateBookmark}
                  />
                );
              })
            )}
          </div>
        )}{" "}
        {data.count !== 0 && (
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
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
            forcePage={forcePage}
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
