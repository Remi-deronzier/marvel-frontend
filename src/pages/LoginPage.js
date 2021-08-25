import { useState, useEffect } from "react";

import LoginSignupContent from "../Components/LoginSignupContent";

import axios from "axios";
import { useHistory } from "react-router-dom";

const LoginPage = ({
  handleLoginSignup,
  handleFormSubmission,
  handleFormEndSubmission,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();

  useEffect(() => {
    document.title = "Connexion - Marvel";
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

  return (
    <LoginSignupContent
      handleSubmit={handleSubmit}
      email={email}
      handleEmail={handleEmail}
      password={password}
      handlePassword={handlePassword}
      buttonSubmissionContent="Se connecter"
      redirectionLink="/signup"
      redirectionContent="Pas encore de compte ? Inscris-toi !"
      displayUsername={false}
      h1Content="Se connecter"
    />
  );
};

export default LoginPage;
