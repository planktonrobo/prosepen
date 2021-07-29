import { useState } from "react";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import FirebaseContext from "../../context/firebase";
import { useDispatch } from "react-redux";
import { toggleBookmarked } from "../../redux/actions/posts";
import { useHistory } from "react-router-dom";

const Bookmark = ({ docId, bookmarkedPiece, user }) => {
  const [bookmarked, setBookmarked] = useState(bookmarkedPiece);
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  let history = useHistory();
  const handleBookmark = async () => {
    if (!user) {
      history.push("/login");
    } else {
      setBookmarked((bookmarked) => !bookmarked);
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

  return bookmarked ? (
    <Button onClick={handleBookmark} className="p-0" variant="none">
      <BsBookmarkFill />
    </Button>
  ) : (
    <Button onClick={handleBookmark} className="p-0" variant="none">
      <BsBookmark />
    </Button>
  );
};

export default Bookmark;
