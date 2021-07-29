import { useState } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  updateFollowedUserFollowers,
  updateLoggedInUserFollowing,
} from "../../services/firebase";
const Following = ({
  userFollows,
  loggedInUserDocId,
  profileDocId,
  user,
  profileId,
  handleNotif,
}) => {
  const history = useHistory();
  const [follows, setFollows] = useState(userFollows);
  async function handleFollow() {
    if (!user) {
      history.push("/login");
    } else {
      setFollows((follows) => !follows);
      await updateLoggedInUserFollowing(loggedInUserDocId, profileId, follows);

      await updateFollowedUserFollowers(profileDocId, user.uid, follows);

      const type = "follow";
      await handleNotif(type);
    }
  }
  return (
    <div
      className="d-flex justify-content-center mx-1"
      style={{ minWidth: 250 }}
    >
      <Button
        onClick={handleFollow}
        variant="outline-dark"
        className="w-100 mx-auto m-3"
      >
        {follows ? "Following ✓" : "Follow"}
      </Button>
    </div>
  );
};

export default Following;
