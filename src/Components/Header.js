import "./Header.css";
import logoMarvel from "../images/logo-marvel.svg";

import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const Header = ({ token, setToken }) => {
  let history = useHistory();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    setToken("");
    history.push("/");
  };

  return (
    <header>
      <Link to="/">
        <img src={logoMarvel} alt="logo Marvel" />
      </Link>
      <Link to="/">
        <button>Personnages</button>
      </Link>
      <Link to="/comics">
        <button>Comics</button>
      </Link>
      <Link to="/bookmarks">
        <button>Favoris</button>
      </Link>
      {!token ? (
        <>
          <Link to="/signup">
            <button>S'inscrire</button>
          </Link>
          <Link to="/login">
            <button>Se connecter</button>
          </Link>
        </>
      ) : (
        <button onClick={handleLogout}>Se déconnecter</button>
      )}
      {token && <span>{Cookies.get("username")}</span>}
    </header>
  );
};

export default Header;
