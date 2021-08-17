import { useEffect, useState } from "react";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import { useDebounce } from "use-debounce";
import * as qs from "qs";
import ReactPaginate from "react-paginate";

const ComicsPage = ({
  token,
  bookmarkName,
  handleNewBookmark,
  isBookmarkAddedModalOpen,
  handleAfterOpenBookmarkModal,
  handleBookmarkAddedModalClose,
}) => {
  const [comics, setComics] = useState({});
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [skip, setskip] = useState(0);

  const [debouncedSearch] = useDebounce(search, 1000);

  let history = useHistory();

  const pageCount = Math.ceil(comics.count / limit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingResults(true);
        const queryParams = qs.stringify({
          title: debouncedSearch,
          limit: limit,
          skip: skip,
        });
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/comics?${queryParams}`
        );
        setComics(response.data);
        setIsGlobalLoading(false);
        setIsLoadingResults(false);
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
    document.title = "Marvel Comics";
  }, [debouncedSearch, limit, skip]);

  // BOOKMARKS

  const handleCreateBookmark = async (title, description, thumbnail) => {
    if (token) {
      await handleNewBookmark(title, description, thumbnail);
    } else {
      history.push("/login");
    }
  };

  // SEARCH BAR

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // PAGINATION

  const handlePageClick = (data) => {
    const selected = data.selected;
    setskip(limit * selected);
  };

  const handleChangeSelect = (e) => {
    setLimit(e.target.value);
  };

  return isGlobalLoading ? (
    <p>En cours de chargement...</p>
  ) : (
    <>
      <Modal
        isOpen={isBookmarkAddedModalOpen}
        onRequestClose={handleBookmarkAddedModalClose}
        onAfterOpen={handleAfterOpenBookmarkModal}
        ariaHideApp={false}
      >
        Ton marque-page <u>{bookmarkName}</u> a bien été ajouté à tes favoris
        !!!
      </Modal>
      {isLoadingResults ? (
        <p>Chargement des résultats...</p>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Rechercher des BDs"
            onChange={handleChangeSearch}
            value={search}
          />
          <br />
          <label>
            Nombre de résultats à afficher :
            <select
              value={limit}
              onChange={handleChangeSelect}
              className="select-page-nb-display"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
          {comics.count === 0 ? (
            <p>Aucun résultat trouvé 😥 !!!</p>
          ) : (
            comics.results.map((comic, index) => {
              return (
                <div key={index}>
                  <img
                    src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                    alt={comic.title}
                  />
                  <p>{comic.title}</p>
                  <p>{comic.description}</p>
                  <button
                    id="submit-btn"
                    onClick={() =>
                      handleCreateBookmark(
                        comic.title,
                        comic.description,
                        comic.thumbnail
                      )
                    }
                  >
                    <FontAwesomeIcon icon="bookmark" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}{" "}
      {comics.count !== 0 && (
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page"}
          previousClassName={"previous-page"}
          nextClassName={"next-page"}
          disabledClassName={"disabled-previous-and-next-label"}
        />
      )}
    </>
  );
};

export default ComicsPage;
