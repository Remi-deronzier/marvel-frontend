import { useEffect, useState } from "react";

import MainPages from "../Components/MainPagesContent";

import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import * as qs from "qs";

const HomePage = ({
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
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [limit, setLimit] = useState(100);
  const [skip, setskip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [forcePage, setForcePage] = useState(0); // to override selected page when a user is on a high number page and change the limit or make a research. Thus, this state enables to prevent from rendering a blank page !!!

  let history = useHistory();

  const location = useLocation();
  const params = qs.parse(location.search.slice(1));
  const onboarding = params.onboarding;

  const pageCount = Math.ceil(data.count / limit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/characters`
        );
        setWholeData(response.data.results);
        setKeyTitle("name");
        setPlaceholderAutosuggest("Aven..");
      } catch (error) {
        alert("an error has occured");
      }
    };
    document.title = "Marvel App Rémi";
    fetchData();
  }, [setWholeData, setKeyTitle, setPlaceholderAutosuggest]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingResults(true);
        const queryParams = qs.stringify({
          name: debouncedSearch,
          limit: limit,
          skip: skip,
          currentPage: currentPage,
        });
        const response = await axios.get(
          `https://marvel-api-remi.herokuapp.com/characters?${queryParams}`
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

  useEffect(() => {
    if (onboarding) {
      setIsWelcomeModalOpen(true); // trigger a welcome modal when the user sign up for the first time
    }
  }, [onboarding]);

  // BOOKMARKS

  const handleCreateBookmark = async (title, description, thumbnail) => {
    if (token) {
      await handleNewBookmark(title, description, thumbnail);
    } else {
      history.push("/login");
    }
  };

  // WELCOME MODAL

  const handleWelcomeModalClose = () => {
    setIsWelcomeModalOpen(false);
  };

  const handleAfterOpenWelcomeModal = () => {
    setTimeout(() => {
      setIsWelcomeModalOpen(false);
    }, 7000);
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
    classNameTitle: "card-title-characters",
    classNameCallToAction: "card-call-to-action-characters",
  };

  const props = {
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
    displayWelcomeModal: true,
    h2Content: "ton super-héros préféré",
    dispayMoreButton: true,
    dispayBookmarkIcon: true,
    titleKey: "name",
    style,
  };

  return (
    <div>
      <MainPages {...props} />
    </div>
  );
};

export default HomePage;
