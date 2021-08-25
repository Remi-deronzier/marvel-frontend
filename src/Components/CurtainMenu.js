import { useEffect } from "react";

import "./CurtainMenu.css";

import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "react-avatar";

const CurtainMenu = ({ token, setToken, className }) => {
  let history = useHistory();

  const openNav = () => {
    document.getElementById("my-nav").style.width = "70%";
    document.getElementById("my-nav-background").style.opacity = "1";
    document.getElementById("my-nav-background").style.width = "100%";
    document.body.style.overflow = "hidden"; // Prevent scrolling when the modal is activated
    document.querySelector(".react-autosuggest__container").style.zIndex = -1;
    if (document.querySelector(".container-loader-results-header")) {
      document.querySelector(".container-loader-results-header").style.zIndex =
        -1;
    }
  };

  const closeNav = () => {
    document.getElementById("my-nav").style.width = "0";
    document.getElementById("my-nav-background").style.opacity = "0%";
    document.getElementById("my-nav-background").style.width = "0%";
    document.body.style.overflow = "auto"; // Enable again scrolling when the modal is desactivated
    document.querySelector(".react-autosuggest__container").style.zIndex = 0;
    if (document.querySelector(".container-loader-results-header")) {
      document.querySelector(
        ".container-loader-results-header"
      ).style.zIndex = 0;
    }
  };

  useEffect(() => {
    const modal = document.getElementById("my-nav-background"); // Close modal when the user clicks outside the modal
    window.onclick = function (event) {
      if (event.target === modal) {
        closeNav();
      }
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    setToken("");
    history.push("/");
    closeNav();
  };

  return (
    <div className={className}>
      <div className="background-menu" id="my-nav-background">
        <div id="my-nav" className="overlay">
          <FontAwesomeIcon
            icon="times"
            className="close-btn"
            onClick={closeNav}
          />
          <div className="overlay-content">
            <Link to="/" onClick={closeNav}>
              Accueil
            </Link>
            <Link to="/comics" onClick={closeNav}>
              BD
            </Link>
            <Link to="/bookmarks" onClick={closeNav}>
              Favoris
            </Link>
            {!token ? (
              <>
                <Link to="/signup" onClick={closeNav}>
                  <button className="btn-curtain-menu button-filled-with-red">
                    S'inscrire
                  </button>
                </Link>
                <Link to="/login" onClick={closeNav}>
                  <button className="btn-curtain-menu button-filled-with-red">
                    Se connecter
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="btn-curtain-menu button-filled-with-red"
              >
                Se déconnecter
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bar-avatar">
        {token && (
          <Avatar
            name={Cookies.get("username")}
            className="avatar-header"
            size="4rem"
            textSizeRatio={2}
          />
        )}
        <FontAwesomeIcon
          icon="bars"
          onClick={openNav}
          className="icon-curtain-menu"
        />
      </div>
    </div>
  );
};

export default CurtainMenu;
