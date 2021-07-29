import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import { useDispatch } from "react-redux";
import { toggleBookmarked } from "../../redux/actions/posts";
import { useHistory } from "react-router-dom";

const Bookmark = ({ docId, bookmarkedPiece }) => {
  const { user } = useContext(UserContext);
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  let history = useHistory();
  const handleBookmark = async () => {
    if (!user) {
      history.push("/login");
    } else {
      dispatch(toggleBookmarked(user.uid, docId));
      await firebase
        .firestore()
        .collection("pieces")
        .doc(docId)
        .update({
          bookmarks: bookmarkedPiece
            ? FieldValue.arrayRemove(user.uid)
            : FieldValue.arrayUnion(user.uid),
        });
    }
  };

  return bookmarkedPiece ? (
    <Button onClick={handleBookmark} className="py-0" variant="none">
      <BsBookmarkFill />
    </Button>
  ) : (
    <Button onClick={handleBookmark} className="py-0" variant="none">
      <BsBookmark />
    </Button>
  );
};

export default Bookmark;
