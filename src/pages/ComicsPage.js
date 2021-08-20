import { useEffect, useState } from "react";

import {
  AutosuggestHighlightMatch,
  escapeRegexCharacters,
} from "../helpers/helper";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import { useDebounce } from "use-debounce";
import * as qs from "qs";
import ReactPaginate from "react-paginate";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import Autosuggest from "react-autosuggest";

const ComicsPage = ({
  token,
  bookmarkName,
  handleNewBookmark,
  isBookmarkAddedModalOpen,
  handleAfterOpenBookmarkModal,
  handleBookmarkAddedModalClose,
}) => {
  const [comics, setComics] = useState({}); // data which is updated each time a research is made
  const [wholeComics, setWholeComics] = useState([]); // data which is fetched just once: when the page is loaded.
  // `wholeData` is used for the Autosuggest component
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
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

  const pageCount = Math.ceil(comics.count / limit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/comics`
        );
        setWholeComics(response.data.results);
      } catch (error) {
        alert("an error has occured");
      }
    };
    document.title = "Marvel Comics";
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingResults(true);
        const queryParams = qs.stringify({
          title: debouncedSearch,
          limit: limit,
          skip: skip,
          currentPage: currentPage,
        });
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/comics?${queryParams}`
        );
        setForcePage(Number(response.data.currentPage));
        setComics(response.data);
        setIsGlobalLoading(false);
        setIsLoadingResults(false);
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
  }, [debouncedSearch, limit, skip, currentPage]);

  // BOOKMARKS

  const handleCreateBookmark = async (title, description, thumbnail) => {
    if (token) {
      await handleNewBookmark(title, description, thumbnail);
    } else {
      history.push("/login");
    }
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
    return wholeComics.filter((character) => regex.test(character.title));
  };

  const getSuggestionValue = (suggestion) => suggestion.title;

  const renderSuggestion = (suggestion, { query }) => {
    const suggestionText = suggestion.title;
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

  return isGlobalLoading ? (
    <p>En cours de chargement...</p>
  ) : (
    <>
      <Modal
        isOpen={isBookmarkAddedModalOpen}
        onRequestClose={handleBookmarkAddedModalClose}
        onAfterOpen={handleAfterOpenBookmarkModal}
        ariaHideApp={false}
      >
        Ton marque-page <u>{bookmarkName}</u> a bien été ajouté à tes favoris
        !!!
      </Modal>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      {/* <input
            type="text"
            placeholder="Rechercher des BDs"
            onChange={handleChangeSearch}
            value={searchAutosuggest}
          /> */}
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
          {comics.count === 0 ? (
            <p>Aucun résultat trouvé 😥 !!!</p>
          ) : (
            comics.results.map((comic, index) => {
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
            })
          )}
        </div>
      )}{" "}
      {comics.count !== 0 && (
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

export default ComicsPage;
