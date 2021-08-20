import { useEffect, useState } from "react";

import {
  AutosuggestHighlightMatch,
  escapeRegexCharacters,
} from "../helpers/helper";

import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as qs from "qs";
import Modal from "react-modal";
import Cookies from "js-cookie";
import { useDebounce } from "use-debounce";
import ReactPaginate from "react-paginate";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import Autosuggest from "react-autosuggest";

const HomePage = ({
  token,
  bookmarkName,
  handleNewBookmark,
  isBookmarkAddedModalOpen,
  handleAfterOpenBookmarkModal,
  handleBookmarkAddedModalClose,
}) => {
  const [data, setData] = useState({}); // data which is updated each time a research is made
  const [wholeData, setWholeData] = useState([]); // data which is fetched just once: when the page is loaded.
  // `wholeData` is used for the Autosuggest component
  const [isLoadingHomePage, setIsLoadingHomePage] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [searchAutosuggest, setSearchAutosuggest] = useState("");
  const [suggestions, setSuggestions] = useState([]); // suggestion for the Autosuggest component
  const [limit, setLimit] = useState(100);
  const [skip, setskip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [forcePage, setForcePage] = useState(0); // to override selected page when a user is on a high number page and change the limit or make a research. Thus, this state enables to prevent from rendering a blank page !!!

  const [debouncedSearch] = useDebounce(
    escapeRegexCharacters(searchAutosuggest),
    1000
  ); // Wait a bit before reloading the page

  let history = useHistory();

  const location = useLocation();
  const params = qs.parse(location.search.slice(1));
  const onboarding = params.onboarding;

  const pageCount = Math.ceil(data.count / limit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/characters`
        );
        setWholeData(response.data.results);
      } catch (error) {
        alert("an error has occured");
      }
    };
    document.title = "Marvel App Rémi";
    fetchData();
  }, []);

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

  // SEARCH BAR WITH AUTOCOMPLETION

  const getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === "") {
      return [];
    }
    const regex = new RegExp(escapedValue, "i");
    return wholeData.filter((character) => regex.test(character.name));
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion, { query }) => {
    const suggestionText = suggestion.name;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    return (
      <div>
        <img
          className="thumbnail"
          src={`${suggestion.thumbnail.path}.${suggestion.thumbnail.extension}`}
          alt=""
        />
        {parts.map((part, index) => {
          const className = part.highlight ? "highlight" : null;
          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
      </div>
    );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleOnChange = (event, { newValue }) => {
    setSearchAutosuggest(newValue);
  };

  const inputProps = {
    placeholder: "Rechercher des personnages de BD",
    value: searchAutosuggest,
    onChange: handleOnChange,
    type: "search",
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
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
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
      {isLoadingResults ? (
        <p>Chargement des résultats...</p>
      ) : (
        <div>
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
          forcePage={forcePage}
        />
      )}
    </>
  );
};

export default HomePage;
