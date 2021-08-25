import { useState, useEffect } from "react";

import Card from "../Components/Card";
import Loader from "../Components/Loader";

import "./CharacterPage.css";

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

  const styleHero = {
    classNameTitle: "card-title-comics",
    classNameCardDetails: "card-details-character-page",
    classNameCallToAction: "card-call-to-action-character-page",
    classNameDescription: "p-description",
    classNameCard: "card-character-page",
  };

  const styleComics = { ...styleHero };

  styleComics.classNameCard = "";

  return isLoading ? (
    <Loader classNameLoader="main" classNameLoaderLocation="page" />
  ) : (
    <div className="container wrapper-page-character">
      <h2>
        Personnage : <u>{data.name}</u>{" "}
      </h2>
      <div className="hero">
        <Card
          data={data}
          dispayMoreButton={false}
          dispayBookmarkIcon={false}
          titleKey="name"
          {...styleHero}
        />
      </div>
      <p className="p-comics-belonging">
        Et voici toutes les BDs où <u>{data.name}</u> est présent
      </p>
      <div className="main-content">
        {data.comics.length === 0 ? (
          <div className="no-results">
            <p className="p-no-results">
              {" "}
              <u>{data.name}</u> est un personnage discret 🐱‍👤 : il n'apparait
              pas si facilement dans les BDs !!!
            </p>
          </div>
        ) : (
          <>
            {data.comics.map((comic, index) => {
              return (
                <Card
                  index={index}
                  key={index}
                  data={comic}
                  dispayMoreButton={false}
                  dispayBookmarkIcon={false}
                  titleKey="title"
                  {...styleComics}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default CharacterPage;
