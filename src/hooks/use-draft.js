import { useState, useEffect, useContext } from "react";
import UserContext from "../context/user";
import { getDraft } from "../services/writing";

export default function useDraft(PiecedocId) {
  const [piece, setPiece] = useState('loading');

  const {user} = useContext(UserContext)

  useEffect(() => {
    async function getPiece() {

      const result = await getDraft(PiecedocId, user?.uid)
      setPiece(result || null);
    }

    getPiece();
  }, [user, PiecedocId]);

  return { piece };
}