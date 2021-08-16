import { useState, useEffect } from "react";

import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SignupPage = ({
  handleLoginSignup,
  handleSubmissionActivation,
  handleSubmissionDesactivation,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRevealedPwd, setIsRevealedPwd] = useState(false);

  let history = useHistory();

  useEffect(() => {
    document.title = "Inscription - Marvel";
  }, []);

  const signup = async () => {
    const data = {
      email: email,
      username: username,
      password: password,
    };
    try {
      handleSubmissionActivation();
      const response = await axios.post(
        "https://marvel-api-remi.herokuapp.com/user/signup",
        data
      );
      const { token, username } = response.data;
      handleLoginSignup(token, username);
      history.push("/?onboarding=true");
    } catch (error) {
      handleSubmissionDesactivation();
      alert(error.response.data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup();
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
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
          type="text"
          placeholder="Nom d'utilisateur *"
          value={username}
          onChange={handleUsername}
          required
        />
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
          S'inscrire
        </button>
      </form>
      <Link to="/login">
        <p>Tu as déjà un compte ? Connecte-toi !</p>
      </Link>
    </div>
  );
};

export default SignupPage;
