import { Redirect } from "react-router-dom";

const BookmarksPage = ({ isConnected }) => {
  return isConnected ? <div>bookmarks page</div> : <Redirect to="/login" />;
};

export default BookmarksPage;
