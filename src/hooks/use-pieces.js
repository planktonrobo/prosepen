import { useState, useEffect, useContext } from "react";
import UserContext from "../context/user";
import { getUserByUserId, getFollowingPieces } from "../services/firebase";

export default function usePieces() {
  const [pieces, setPieces] = useState(null);

  const {
    user: { uid: userId = "" },
  } = useContext(UserContext);

  useEffect(() => {
    async function getTimelinePieces() {
      // does User Follow People?

      setPieces(null);
      const [{ following }] = await getUserByUserId(userId);
      if (following.length > 0) {
        const followedUserPieces = await getFollowingPieces(userId, following);

        setPieces(followedUserPieces);
      } else {
        setPieces(null);
      }
    }

    getTimelinePieces();
  }, [userId]);

  return { pieces };
}
