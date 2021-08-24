import Card from "./Card";

import "./MainPages.css";

import Modal from "react-modal";
import Autosuggest from "react-autosuggest";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";

const MainPages = ({
  isGlobalLoading,
  isWelcomeModalOpen,
  handleWelcomeModalClose,
  handleAfterOpenWelcomeModal,
  isBookmarkAddedModalOpen,
  handleBookmarkAddedModalClose,
  handleAfterOpenBookmarkModal,
  bookmarkName,
  suggestions,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested,
  getSuggestionValue,
  renderSuggestion,
  inputProps,
  data,
  limit,
  isLoadingResults,
  handleChangeSelect,
  handleCreateBookmark,
  forcePage,
  handlePageClick,
  pageCount,
  displayWelcomeModal,
  h2Content,
  titleKey,
  dispayBookmarkIcon,
  dispayMoreButton,
  style,
}) => {
  return isGlobalLoading ? (
    <p>En cours de chargement...</p>
  ) : (
    <>
      {displayWelcomeModal && (
        <Modal
          isOpen={isWelcomeModalOpen}
          onRequestClose={handleWelcomeModalClose}
          onAfterOpen={handleAfterOpenWelcomeModal}
          ariaHideApp={false}
        >
          Bonjour <u>{Cookies.get("username")}</u>, bienvenue sur la meilleure
          API de MARVEL ! 🎉
        </Modal>
      )}
      <Modal
        isOpen={isBookmarkAddedModalOpen}
        onRequestClose={handleBookmarkAddedModalClose}
        onAfterOpen={handleAfterOpenBookmarkModal}
        ariaHideApp={false}
      >
        Ton marque-page <u>{bookmarkName}</u> a bien été ajouté à tes favoris
        !!!
      </Modal>{" "}
      <div className="container main-content-wrapper">
        <h2>Recherche {h2Content}</h2>
        <div className="search-bar-page">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
        <div className="pagination-top">
          <p>{data.count} résultats</p>
          <label>
            Nombre de résultats à afficher :
            <select
              className="select-limit"
              value={limit}
              onChange={handleChangeSelect}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
        {isLoadingResults ? (
          <p>Chargement des résultats...</p>
        ) : (
          <div className="main-content">
            {data.count === 0 ? (
              <div className="no-results">
                <p className="p-no-results">Aucun résultat trouvé 😥 !!!</p>
              </div>
            ) : (
              data.results.map((character, index) => {
                return (
                  <Card
                    index={index}
                    key={index}
                    data={character}
                    handleCreateBookmark={handleCreateBookmark}
                    dispayMoreButton={dispayMoreButton}
                    dispayBookmarkIcon={dispayBookmarkIcon}
                    titleKey={titleKey}
                    {...style}
                  />
                );
              })
            )}
          </div>
        )}{" "}
        {data.count !== 0 && (
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
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
            forcePage={forcePage}
          />
        )}
      </div>
    </>
  );
};

export default MainPages;
