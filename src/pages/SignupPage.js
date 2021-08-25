import { useState, useEffect } from "react";

import LoginSignupContent from "../Components/LoginSignupContent";

import axios from "axios";
import { useHistory } from "react-router-dom";

const SignupPage = ({
  handleLoginSignup,
  handleFormSubmission,
  handleFormEndSubmission,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      handleFormSubmission();
      const response = await axios.post(
        "https://marvel-api-remi.herokuapp.com/user/signup",
        data
      );
      const { token, username, _id } = response.data;
      handleLoginSignup(token, username, _id);
      history.push("/?onboarding=true");
    } catch (error) {
      handleFormEndSubmission();
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

  return (
    <LoginSignupContent
      handleSubmit={handleSubmit}
      username={username}
      handleUsername={handleUsername}
      email={email}
      handleEmail={handleEmail}
      password={password}
      handlePassword={handlePassword}
      buttonSubmissionContent="S'inscrire"
      redirectionLink="/login"
      redirectionContent="Tu as déjà un compte ? Connecte-toi !"
      displayUsername={true}
      h1Content="S'inscrire"
    />
  );
};

export default SignupPage;
