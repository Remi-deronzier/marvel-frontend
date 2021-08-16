import { useEffect, useState } from "react";

import axios from "axios";

const ComicsPage = () => {
  const [comics, setComics] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/comics`
        );
        setComics(response.data);
        setIsLoading(false);
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
    document.title = "Marvel Comics";
  }, []);

  return isLoading ? (
    <p>En cours de chargement...</p>
  ) : (
    <div>
      {comics.results.map((comic, index) => {
        return (
          <div key={index}>
            <img
              src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
              alt={comic.title}
            />
            <p>{comic.title}</p>
            <p>{comic.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ComicsPage;
