import { useState, useEffect, useContext } from "react";
import { getUsernamePieces} from "../services/firebase";
import UserContext from "../context/user";

export default function useProfilePieces(profileUserId) {
  const [pieces, setPieces] = useState("loading");
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function getProfilePieces() {
      const result = await getUsernamePieces(user?.uid, profileUserId);
      setPieces(result?.piecesWithUserDetails.length > 0 ? result : null) ;
    }

    getProfilePieces();
  }, [user, profileUserId]);

  return { pieces };
}
