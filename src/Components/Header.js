import CurtainMenu from "./CurtainMenu";
import Loader from "./Loader";

import "./Header.css";
import logoMarvel from "../images/logo-marvel.svg";

import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import Avatar from "react-avatar";
import Autosuggest from "react-autosuggest";

const Header = ({
  token,
  setToken,
  inputProps,
  renderSuggestion,
  getSuggestionValue,
  onSuggestionsClearRequested,
  onSuggestionsFetchRequested,
  suggestions,
  isLoadingResults,
}) => {
  let history = useHistory();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("userID");
    setToken("");
    history.push("/");
  };

  return (
    <header>
      <div className="container wrapper-header">
        <div className="header-call1">
          <Link to="/">
            <img src={logoMarvel} alt="logo Marvel" />
          </Link>
        </div>
        <div className="header-call2">
          <Link to="/">
            <button className="btn-header-margin button-with-red-border">
              Accueil
            </button>
          </Link>
          <Link to="/comics">
            <button className="btn-header-margin button-with-red-border">
              BD
            </button>
          </Link>
          <Link to="/bookmarks">
            <button className="btn-header-margin button-with-red-border">
              Favoris
            </button>
          </Link>
          {!token ? (
            <>
              <Link to="/signup">
                <button className="btn-header-margin button-filled-with-red">
                  S'inscrire
                </button>
              </Link>
              <Link to="/login">
                <button className="button-filled-with-red">Se connecter</button>
              </Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className="button-filled-with-red">
                Se déconnecter
              </button>
              <Avatar
                name={Cookies.get("username")}
                className="avatar-header"
                size="4rem"
                textSizeRatio={2}
              />
            </>
          )}
        </div>
        <CurtainMenu
          token={token}
          setToken={setToken}
          className="curtain-menu"
        />
      </div>
      <div className="search-bar-header container">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        {isLoadingResults && (
          <Loader classNameLoader="results" classNameLoaderLocation="header" />
        )}
      </div>
    </header>
  );
};

export default Header;
