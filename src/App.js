import { useState } from "react";

import CharacterPage from "./pages/CharacterPage";
import HomePage from "./pages/HomePage";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ComicsPage from "./pages/ComicsPage";
import BookmarksPage from "./pages/BookmarksPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import {
  AutosuggestHighlightMatch,
  escapeRegexCharacters,
} from "./helpers/helper";

import "./App.css";

import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { useDebounce } from "use-debounce";
import Cookies from "js-cookie";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBookmark,
  faEye,
  faTimes,
  faBars,
  faQuestionCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
library.add(faBookmark, faEye, faTimes, faBars, faQuestionCircle, faSearch);

const App = () => {
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [bookmarkName, setBookmarkName] = useState("");
  const [isBookmarkAddedModalOpen, setIsBookmarkAddedModalOpen] =
    useState(false);

  const [wholeData, setWholeData] = useState([]); // data which is fetched just once: when the page is loaded.
  // `wholeData` is used for the Autosuggest component
  const [searchAutosuggest, setSearchAutosuggest] = useState("");
  const [suggestions, setSuggestions] = useState([]); // suggestion for the Autosuggest component
  const [keyTitle, setKeyTitle] = useState("");
  const [placeholderAutosuggest, setPlaceholderAutosuggest] = useState("");

  const [debouncedSearch] = useDebounce(
    escapeRegexCharacters(searchAutosuggest),
    1000
  ); // Wait a bit before reloading the page

  // SEARCH BAR WITH AUTOCOMPLETION

  const getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === "") {
      return [];
    }
    const regex = new RegExp(escapedValue, "i");
    const maxSuggestionsToDisplay = 7;
    return wholeData.reduce((res, element) => {
      if (
        regex.test(element[keyTitle]) &&
        res.length <= maxSuggestionsToDisplay - 1 // add -1 to have exactly 7 suggestions at most instead of 8 otherwise
      ) {
        res.push(element);
      }
      return res;
    }, []);
  };

  const getSuggestionValue = (suggestion) => suggestion[keyTitle];

  const renderSuggestion = (suggestion, { query }) => {
    const suggestionText = suggestion[keyTitle];
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    return (
      <div className="suggestion-content">
        <img
          className="thumbnail"
          src={`${suggestion.thumbnail.path}.${suggestion.thumbnail.extension}`}
          alt={suggestion[keyTitle]}
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
    placeholder: placeholderAutosuggest,
    value: searchAutosuggest,
    onChange: handleOnChange,
  };

  // MANAGE SEARCH BAR STYLE ACCORDING TO SCROLL

  window.addEventListener("scroll", () => {
    let scroll = window.scrollY; // Axe Y
    const elem = [...document.querySelectorAll(".react-autosuggest__input")][1]; // select the second search bar (not the first search bar in the header)
    if (elem) {
      if (scroll < 100) {
        elem.style.width = "calc(100% - 2rem)";
      } else {
        elem.style.width = "25%";
      }
    }
  });

  // LOGIN AND SIGNUP

  const handleLoginSignup = (token, username, id) => {
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("username", username, { expires: 7 });
    Cookies.set("userID", id, { expires: 7 });
    setToken(Cookies.get("token"));
  };

  // MAKE A REQUEST TO THE SERVER (LOADER + BUTTON)

  const handleSubmission = () => {
    [...document.querySelectorAll("#submit-btn")].map((e) =>
      e.setAttribute("disabled", "disabled")
    ); // Disable the button;
  };

  const handleEndSubmission = () => {
    [...document.querySelectorAll("#submit-btn")].map((e) =>
      e.removeAttribute("disabled")
    ); // Enable the button;
  };

  // CREATE A BOOKMARK

  const handleNewBookmark = async (title, description, thumbnail) => {
    const name = prompt(
      "Intitulé de ton marque-page",
      "Mon premier marque-page"
    );
    if (name === null || name === "") {
      return alert("You must specify a name");
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail_path", thumbnail.path);
    formData.append("thumbnail_extension", thumbnail.extension);
    try {
      handleSubmission();
      await axios.post(
        "https://marvel-api-remi.herokuapp.com/bookmarks/create",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleEndSubmission();
      setBookmarkName(name);
      setIsBookmarkAddedModalOpen(true);
    } catch (error) {
      handleEndSubmission();
      alert(error.response.data.message);
    }
  };

  // BOOKMARK MODAL

  const handleBookmarkAddedModalClose = () => {
    setIsBookmarkAddedModalOpen(false);
  };

  const handleAfterOpenBookmarkModal = () => {
    setTimeout(() => {
      setIsBookmarkAddedModalOpen(false);
    }, 7000);
  };

  return (
    <Router>
      <Header
        token={token}
        setToken={setToken}
        inputProps={inputProps}
        renderSuggestion={renderSuggestion}
        getSuggestionValue={getSuggestionValue}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        suggestions={suggestions}
      />
      <Switch>
        <Route exact path="/">
          <HomePage
            token={token}
            bookmarkName={bookmarkName}
            handleNewBookmark={handleNewBookmark}
            isBookmarkAddedModalOpen={isBookmarkAddedModalOpen}
            handleAfterOpenBookmarkModal={handleAfterOpenBookmarkModal}
            handleBookmarkAddedModalClose={handleBookmarkAddedModalClose}
            inputProps={inputProps}
            renderSuggestion={renderSuggestion}
            getSuggestionValue={getSuggestionValue}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            suggestions={suggestions}
            debouncedSearch={debouncedSearch}
            setWholeData={setWholeData}
            setKeyTitle={setKeyTitle}
            setPlaceholderAutosuggest={setPlaceholderAutosuggest}
          />
        </Route>
        <Route path="/element/:id">
          <CharacterPage />
        </Route>
        <Route path="/comics">
          <ComicsPage
            token={token}
            bookmarkName={bookmarkName}
            handleNewBookmark={handleNewBookmark}
            isBookmarkAddedModalOpen={isBookmarkAddedModalOpen}
            handleAfterOpenBookmarkModal={handleAfterOpenBookmarkModal}
            handleBookmarkAddedModalClose={handleBookmarkAddedModalClose}
            inputProps={inputProps}
            renderSuggestion={renderSuggestion}
            getSuggestionValue={getSuggestionValue}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            suggestions={suggestions}
            debouncedSearch={debouncedSearch}
            setWholeData={setWholeData}
            setKeyTitle={setKeyTitle}
            setPlaceholderAutosuggest={setPlaceholderAutosuggest}
          />
        </Route>
        <Route path="/bookmarks">
          <BookmarksPage token={token} />
        </Route>
        <Route path="/login">
          <LoginPage
            handleLoginSignup={handleLoginSignup}
            handleFormSubmission={handleSubmission}
            handleFormEndSubmission={handleEndSubmission}
          />
        </Route>
        <Route path="/signup">
          <SignupPage
            handleLoginSignup={handleLoginSignup}
            handleFormSubmission={handleSubmission}
            handleFormEndSubmission={handleEndSubmission}
          />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
