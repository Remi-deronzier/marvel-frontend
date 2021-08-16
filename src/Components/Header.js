import "./Header.css";
import logoMarvel from "../images/logo-marvel.svg";

import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const Header = ({ isConnected, setIsConnected }) => {
  let history = useHistory();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    setIsConnected("");
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
      {!isConnected ? (
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
      {isConnected && <span>{Cookies.get("username")}</span>}
    </header>
  );
};

export default Header;
