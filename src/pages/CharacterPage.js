import { useState, useEffect } from "react";

import axios from "axios";
import { useParams } from "react-router-dom";

const CharacterPage = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/comics/${id}`
        );
        setData(response.data);
        setIsLoading(false);
        document.title = `${response.data.name} - Marvel`;
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
  }, [id]);

  return isLoading ? (
    <p>En cours de chargement...</p>
  ) : (
    <div>
      {data.comics.map((comic, index) => {
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

export default CharacterPage;
