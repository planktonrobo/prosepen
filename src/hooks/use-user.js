import { useState, useEffect } from "react";
import { getUserByUserId } from "../services/firebase";

export default function useUser(user, didInvalidate) {
  const [activeUser, setActiveUser] = useState();
  
  useEffect(() => {
    async function getUserObjByUserId() {
      const userId = user?.uid;
       if (userId ) {
      const [response] = await getUserByUserId(userId);
      setActiveUser(response);}
      else {
      setActiveUser({})}
    }

      getUserObjByUserId();
    
  }, [user, didInvalidate]);

  return { user: activeUser };
}
