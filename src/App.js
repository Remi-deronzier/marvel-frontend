import { useState } from "react";

import CharacterPage from "./pages/CharacterPage";
import HomePage from "./pages/HomePage";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ComicsPage from "./pages/ComicsPage";
import BookmarksPage from "./pages/BookmarksPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

import "./App.css";

import Cookies from "js-cookie";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookmark, faEye } from "@fortawesome/free-solid-svg-icons";
library.add(faBookmark, faEye);

const App = () => {
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [bookmarkName, setBookmarkName] = useState("");
  const [isBookmarkAddedModalOpen, setIsBookmarkAddedModalOpen] =
    useState(false);

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
      <Header token={token} setToken={setToken} />
      <Switch>
        <Route exact path="/">
          <HomePage
            token={token}
            bookmarkName={bookmarkName}
            handleNewBookmark={handleNewBookmark}
            isBookmarkAddedModalOpen={isBookmarkAddedModalOpen}
            handleAfterOpenBookmarkModal={handleAfterOpenBookmarkModal}
            handleBookmarkAddedModalClose={handleBookmarkAddedModalClose}
          />
        </Route>
        <Route path="/character/:id">
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
