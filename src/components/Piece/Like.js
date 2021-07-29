import { BsHeart, BsHeartFill } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useContext, useState } from "react";
import FirebaseContext from "../../context/firebase";
import { useDispatch } from "react-redux";
import { toggleLiked } from "../../redux/actions/posts";
import { useHistory } from "react-router-dom";

const Like = ({ likecount, docId, likedPiece, user, handleNotif }) => {
  const [liked, setLiked] = useState(likedPiece);
  const [count, setCount] = useState(likecount);

  const { firebase, FieldValue } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  let history = useHistory();
  const handleToggleLiked = async () => {
    if (!user) {
      history.push("/login");
    } else {
      setLiked((liked) => !liked);
      setCount(liked ? count - 1 : count + 1);
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

  return liked ? (
    <Button
      onClick={handleToggleLiked}
      className="py-0"
      style={{ color: "red" }}
      variant="none"
    >
      <BsHeartFill /> <span className="small text-muted">{count}</span>
    </Button>
  ) : (
    <Button onClick={handleToggleLiked} className="py-0" variant="none">
      <BsHeart /> <span className="small text-muted">{count}</span>
    </Button>
  );
};

export default Like;
