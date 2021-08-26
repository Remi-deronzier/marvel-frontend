import { useEffect, useState } from "react";

import Card from "../Components/Card";
import Loader from "../Components/Loader";

import "./CharacterAndBookmarkPages.css";

import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const BookmarksPage = ({ token }) => {
  const [bookmarks, setBookmarks] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/bookmarks/user/${Cookies.get(
            "userID"
          )}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setBookmarks(response.data);
        setIsLoading(false);
      } catch (error) {
        alert(error.response.data.error);
      }
    };
    fetchData();
    document.title = "Tes favoris - Marvel";
  }, [token]);

  const style = {
    classNameTitle: "card-title-comics",
    classNameCardDetails: "card-details-character-page",
    classNameCallToAction: "card-call-to-action-character-page",
    classNameDescription: "p-description",
    classNameCard: "",
  };

  return token ? (
    isLoading ? (
      <Loader classNameLoader="main" classNameLoaderLocation="page" />
    ) : (
      <div className="container wrapper-page-character">
        <h2>Tes favoris</h2>
        <div className="main-content-bookmarks">
          {bookmarks.length === 0 ? (
            <div className="no-results">
              <p className="p-no-results">
                Tu n'as pas encore enregistré de favoris
              </p>
            </div>
          ) : (
            <>
              {bookmarks.map((bookmark, index) => {
                return (
                  <Card
                    index={index}
                    key={index}
                    data={bookmark}
                    dispayMoreButton={false}
                    dispayBookmarkIcon={false}
                    titleKey="title"
                    {...style}
                    displayBookmarkName={true}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    )
  ) : (
    <Redirect to="/login" />
  );
};

export default BookmarksPage;
