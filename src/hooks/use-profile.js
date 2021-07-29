import { useState, useEffect} from "react";
import { getUserbyUsername } from "../services/firebase";

export default function useProfile(username) {
  const [profile, setProfile] = useState('loading');


  useEffect(() => {
    async function getProfile() {

      const result = await getUserbyUsername(username)
      setProfile(result[0] || null);
    }

    getProfile();
  }, [username]);

  return { profile };
}
