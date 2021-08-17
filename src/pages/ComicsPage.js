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
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [debouncedSearch] = useDebounce(search, 1000);

  let history = useHistory();

  const isExceedPageNoSearch = currentPage > pageCount; // manage the fact that when a user wants to display a high limit but is on a big page number, something is displayed instead of a blank page
  const isExceedPageWithSearch = debouncedSearch && currentPage > pageCount; // manage event : a user make a research but is on a page higher than 1, thus no results would be displayes which is annoying,
  const isExceedPage = isExceedPageWithSearch || isExceedPageNoSearch;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingResults(true);
        const queryParams = qs.stringify({
          title: debouncedSearch,
          limit: limit,
          skip: isExceedPage ? 0 : skip,
        });
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/comics?${queryParams}`
        );
        setComics(response.data);
        setIsGlobalLoading(false);
        setIsLoadingResults(false);
        setPageCount(Math.ceil(response.data.count / limit));
        if (isExceedPage) {
          setCurrentPage(0);
          setskip(0);
        }
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
    document.title = "Marvel Comics";
  }, [debouncedSearch, limit, skip, isExceedPage]);

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
    setCurrentPage(selected);
    setskip(limit * selected);
  };

  const handleChangeSelect = (e) => {
    setLimit(e.target.value);
    setPageCount(Math.ceil(comics.count / e.target.value));
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
          forcePage={currentPage}
        />
      )}
    </>
  );
};

export default ComicsPage;
