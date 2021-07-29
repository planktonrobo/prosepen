import { useState, useEffect } from "react";
import { getDraftList } from "../services/writing";

export default function useDrafts(user) {
  const [drafts, setDrafts] = useState('loading');


  useEffect(() => {
    async function getDrafts() {

      const result = await getDraftList(user?.uid)
      setDrafts(result || null);
    }

    getDrafts();
  }, [user]);

  return { drafts };
}