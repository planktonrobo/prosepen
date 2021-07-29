import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
} from "../../services/firebase";

const SuggestedProfile = ({
  profileDocId,
  username,
  picture,
  profileId,
  userId,
  loggedInUserDocId,
  bio,
}) => {
  const [followed, setFollowed] = useState(false);

  async function handleFollowUser() {
    setFollowed(true);

    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);

    await updateFollowedUserFollowers(profileDocId, userId, false);
  }

  return !followed ? (
    <div className="media text-muted pt-2">
      <Link to={`/p/${username}`}>
        <img
          src={picture}
          alt={username}
          style={{ width: 36 }}
          className="mr-2 rounded-circle"
        />
      </Link>
      <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
        <div className="d-flex justify-content-between align-items-center w-100">
          <Link className="text-dark " to={`/p/${username}`}>
            <strong>@{username}</strong>
          </Link>
          <Button onClick={handleFollowUser} className="p-0" variant="link">
            <small>Follow</small>
          </Button>
        </div>
        {bio ? <span className="d-block">{bio}</span> : null}
      </div>
    </div>
  ) : null;
};

export default SuggestedProfile;
