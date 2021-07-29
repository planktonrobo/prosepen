import { BsHeart, BsHeartFill } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import { useDispatch } from "react-redux";
import { toggleLiked } from "../../redux/actions/posts";
import { useHistory } from "react-router-dom";

const Like = ({ likecount, docId, likedPiece, handleNotif }) => {
  const { user } = useContext(UserContext);
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  let history = useHistory();
  async function handleToggleLiked() {
    if (!user) {
      history.push("/login");
    } else {
      dispatch(toggleLiked(user.uid, docId));
      await firebase
        .firestore()
        .collection("pieces")
        .doc(docId)
        .update({
          likes: likedPiece
            ? FieldValue.arrayRemove(user.uid)
            : FieldValue.arrayUnion(user.uid),
          likeCount: likedPiece
            ? FieldValue.increment(-1)
            : FieldValue.increment(1),
        });
      const type = "like";
      !likedPiece && (await handleNotif(user.uid, type));
    }
  };

  return likedPiece ? (
    <Button
      onClick={handleToggleLiked}
      className="py-0"
      style={{ color: "red" }}
      variant="none"
    >
      <BsHeartFill /> <span className="small text-muted">{likecount}</span>
    </Button>
  ) : (
    <Button onClick={handleToggleLiked} className="py-0" variant="none">
      <BsHeart /> <span className="small text-muted">{likecount}</span>
    </Button>
  );
};

export default Like;
