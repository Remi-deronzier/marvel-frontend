import { useEffect, useState } from "react";

import MainPages from "../Components/MainPages";

import axios from "axios";
import * as qs from "qs";
import { useHistory } from "react-router-dom";

const ComicsPage = ({
  token,
  bookmarkName,
  handleNewBookmark,
  isBookmarkAddedModalOpen,
  handleAfterOpenBookmarkModal,
  handleBookmarkAddedModalClose,
  inputProps,
  renderSuggestion,
  getSuggestionValue,
  onSuggestionsClearRequested,
  onSuggestionsFetchRequested,
  suggestions,
  debouncedSearch,
  setWholeData,
  setKeyTitle,
  setPlaceholderAutosuggest,
}) => {
  const [data, setData] = useState({}); // data which is updated each time a research is made
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [limit, setLimit] = useState(100);
  const [skip, setskip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [forcePage, setForcePage] = useState(0); // to override selected page when a user is on a high number page and change the limit or make a research. Thus, this state enables to prevent from rendering a blank page !!!

  let history = useHistory();

  const pageCount = Math.ceil(data.count / limit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/comics`
        );
        setWholeData(response.data.results);
        setKeyTitle("title");
        setPlaceholderAutosuggest("Spid..");
      } catch (error) {
        alert("an error has occured");
      }
    };
    document.title = "Marvel Comics";
    fetchData();
  }, [setWholeData, setKeyTitle, setPlaceholderAutosuggest]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingResults(true);
        const queryParams = qs.stringify({
          title: debouncedSearch,
          limit: limit,
          skip: skip,
          currentPage: currentPage,
        });
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/comics?${queryParams}`
        );
        setForcePage(Number(response.data.currentPage));
        setData(response.data);
        setIsGlobalLoading(false);
        setIsLoadingResults(false);
      } catch (error) {
        alert("an error has occured");
      }
    };
    fetchData();
  }, [debouncedSearch, limit, skip, currentPage]);

  // BOOKMARKS

  const handleCreateBookmark = async (title, description, thumbnail) => {
    if (token) {
      await handleNewBookmark(title, description, thumbnail);
    } else {
      history.push("/login");
    }
  };

  // PAGINATION

  const handlePageClick = (data) => {
    const selected = data.selected;
    setCurrentPage(selected);
    setskip(limit * selected);
  };

  const handleChangeSelect = (e) => {
    setLimit(e.target.value);
  };

  const style = {
    classNameTitle: "card-title-comics",
    classNameCallToAction: "card-call-to-action-comics",
  };

  const props = {
    isGlobalLoading,
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
    displayWelcomeModal: false,
    h2Content: "ta BD préférée",
    dispayMoreButton: false,
    dispayBookmarkIcon: true,
    titleKey: "title",
    style,
  };

  return (
    <div>
      <MainPages {...props} />
    </div>
  );
};

export default ComicsPage;
