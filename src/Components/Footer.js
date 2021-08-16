import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="center-footer">
        <p className="p-footer">
          Made with{" "}
          <a
            className="a-footer"
            href="https://reactjs.org/"
            target="_blank"
            rel="noreferrer"
          >
            React
          </a>{" "}
          at{" "}
          <a
            className="a-footer"
            href="https://www.lereacteur.io/"
            target="_blank"
            rel="noreferrer"
          >
            Le Reacteur
          </a>{" "}
          by{" "}
          <a
            className="a-footer"
            href="https://github.com/Remi-deronzier"
            target="_blank"
            rel="noreferrer"
          >
            Rémi
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
