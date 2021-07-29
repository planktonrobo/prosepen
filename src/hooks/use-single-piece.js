import { useState, useEffect, useContext } from "react";
import UserContext from "../context/user";
import { getSinglePiece } from "../services/firebase";

export default function usePiece(PiecedocId) {
  const [piece, setPiece] = useState('loading');

  const {user} = useContext(UserContext)

  useEffect(() => {
    async function getPiece() {

      const result = await getSinglePiece(PiecedocId, user?.uid)
      setPiece(result || null);
    }

    getPiece();
  }, [user, PiecedocId]);

  return { piece };
}
