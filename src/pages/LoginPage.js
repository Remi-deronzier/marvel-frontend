import { useState, useEffect } from "react";

import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginPage = ({
  handleLoginSignup,
  handleFormSubmission,
  handleFormEndSubmission,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRevealedPwd, setIsRevealedPwd] = useState(false);

  let history = useHistory();

  useEffect(() => {
    document.title = "Connection - Marvel";
  }, []);

  const login = async () => {
    const data = {
      email: email,
      password: password,
    };
    try {
      handleFormSubmission();
      const response = await axios.post(
        "https://marvel-api-remi.herokuapp.com/user/login",
        data
      );
      const { token, username, _id } = response.data;
      handleLoginSignup(token, username, _id);
      history.push("/bookmarks");
    } catch (error) {
      handleFormEndSubmission();
      alert(error.response.data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login();
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleRevealPwd = () => {
    setIsRevealedPwd(!isRevealedPwd);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={handleEmail}
          required
        />
        <div className="div-password">
          <input
            className="input-signup-login input"
            type={isRevealedPwd ? "text" : "password"}
            placeholder="Mot de passe *"
            value={password}
            onChange={handlePassword}
            required
          />
          <FontAwesomeIcon
            icon="eye"
            className="icon-eye"
            onClick={handleRevealPwd}
          />
        </div>
        <p>
          <span>* </span>Champs obligatoires
        </p>
        <button type="submit" id="submit-btn">
          Se connecter
        </button>
      </form>
      <Link to="/signup">
        <p>Pas encore de compte ? Inscris-toi !</p>
      </Link>
    </div>
  );
};

export default LoginPage;
