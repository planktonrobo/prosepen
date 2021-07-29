import { useState, useEffect } from "react";
import { getCommentDetails } from "../services/firebase";

export default function useComments(commentsarg) {
  const [comments, setComments] = useState(null);

  useEffect(() => {
    async function getComments() {

      const {commentdeets} = await getCommentDetails(commentsarg)
      setComments(commentdeets || {});
    }

    getComments();
  }, [commentsarg]);

  return { comments };
}
