import { useEffect, useState } from "react";

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
    document.title = "Your bookmarks - Marvel";
  }, [token]);

  return token ? (
    isLoading ? (
      <p>En cours de chargement...</p>
    ) : (
      <div>
        {bookmarks.length === 0 ? (
          <p>Tu n'as pas encore enregistré de favoris</p>
        ) : (
          bookmarks.map((bookmark, index) => {
            return (
              <div key={index}>
                <p>{bookmark.name}</p>
                <img
                  src={`${bookmark.thumbnail_path}.${bookmark.thumbnail_extension}`}
                  alt={bookmark.title}
                />
                <p>{bookmark.title}</p>
                <p>{bookmark.description}</p>
              </div>
            );
          })
        )}
      </div>
    )
  ) : (
    <Redirect to="/login" />
  );
};

export default BookmarksPage;
