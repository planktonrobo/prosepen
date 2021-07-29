import { useState, useEffect } from "react";
import { getNotifDetails} from "../services/firebase";

export default function useNotifs(notifications) {
  const [notifs, setNotifs] = useState(null);
  const value = notifications?.docs.map((doc) => ({ notifDocId : doc.id,  ...doc.data()}))
  useEffect(() => {
    async function getNotifications() {
      if (notifications) {
      const {notifdeets} = await getNotifDetails(value)
      setNotifs(notifdeets || null)};
    }

    getNotifications();
  }, [notifications]);

  return { notifs };
}
