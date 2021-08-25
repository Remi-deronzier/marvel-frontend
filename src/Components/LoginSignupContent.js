import { useState } from "react";

import "./LoginSignupContent.css";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginSignupContent = ({
  handleSubmit,
  username,
  handleUsername,
  email,
  handleEmail,
  password,
  handlePassword,
  displayUsername,
  redirectionContent,
  redirectionLink,
  buttonSubmissionContent,
  h1Content,
}) => {
  const [isRevealedPwd, setIsRevealedPwd] = useState(false);

  const handleRevealPwd = () => {
    setIsRevealedPwd(!isRevealedPwd);
  };

  return (
    <div className="container login-signup-content">
      <div className="wrapper-form-signup-login">
        <h1 className="title-signup-login">{h1Content}</h1>
        <div className="submission-form-login-signup">
          <form onSubmit={handleSubmit} className="login-signup-form">
            {displayUsername && (
              <input
                type="text"
                placeholder="Nom d'utilisateur *"
                value={username}
                onChange={handleUsername}
                required
                className="input-username-email"
              />
            )}
            <input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={handleEmail}
              required
              className="input-username-email"
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
            <p className="p-mandatory-fields">
              <span className="asterisk">* </span>Champs obligatoires
            </p>
            <div className="btn-submission">
              <button
                type="submit"
                id="submit-btn"
                className="button-filled-with-red button-login-signup-submission"
              >
                {buttonSubmissionContent}
              </button>
            </div>
          </form>
        </div>
        <Link to={redirectionLink} className="login-signup-redirection">
          <p>{redirectionContent}</p>
        </Link>
      </div>
    </div>
  );
};

export default LoginSignupContent;
