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
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import { useDebounce } from "use-debounce";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookmark, faEye } from "@fortawesome/free-solid-svg-icons";
library.add(faBookmark, faEye);

const App = () => {
  const [isConnected, setIsConnected] = useState(Cookies.get("token") || "");

  const handleLoginSignup = (token, username) => {
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("username", username, { expires: 7 });
    setIsConnected(Cookies.get("token"));
  };

  const handleSubmissionActivation = () => {
    document.querySelector("#submit-btn").setAttribute("disabled", "disabled"); // Disable the submit button;
  };

  const handleSubmissionDesactivation = () => {
    document.querySelector("#submit-btn").removeAttribute("disabled"); // Enable the submit button;
  };

  return (
    <Router>
      <Header isConnected={isConnected} setIsConnected={setIsConnected} />
      <Switch>
        <Route exact path="/">
          <HomePage
            isConnected={isConnected}
            handleSubmissionActivation={handleSubmissionActivation}
            handleSubmissionDesactivation={handleSubmissionDesactivation}
          />
        </Route>
        <Route path="/character/:id">
          <CharacterPage />
        </Route>
        <Route path="/comics">
          <ComicsPage />
        </Route>
        <Route path="/bookmarks">
          <BookmarksPage isConnected={isConnected} />
        </Route>
        <Route path="/login">
          <LoginPage
            handleLoginSignup={handleLoginSignup}
            handleSubmissionActivation={handleSubmissionActivation}
            handleSubmissionDesactivation={handleSubmissionDesactivation}
          />
        </Route>
        <Route path="/signup">
          <SignupPage
            handleLoginSignup={handleLoginSignup}
            handleSubmissionActivation={handleSubmissionActivation}
            handleSubmissionDesactivation={handleSubmissionDesactivation}
          />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
