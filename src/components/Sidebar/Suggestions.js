import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { getSuggestedProfiles } from "../../services/firebase";
import SuggestedProfile from "./SuggestedProfile";

const Suggestions = ({ userId, following, loggedInUserDocId }) => {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getSuggestedProfiles(userId, following);
      setProfiles(response);
    }
    if (userId) {
      suggestedProfiles();
    }
  }, [userId, following]);

  return !profiles ? (
    <Skeleton count={1} height={150} className="my-4 mr-3 d-none d-md-block" />
  ) : profiles.length > 0 ? (
    <div className="my-4 d-none d-md-block mr-3">
      <h5 className="border-bottom border-gray pb-2 mb-0">Featured</h5>

      {profiles.map((profile) => (
        <SuggestedProfile
          key={profile.docId}
          bio={profile.bio}
          profileDocId={profile.docId}
          username={profile.username}
          picture={profile.picture}
          fullname={profile.fullName}
          profileId={profile.userId}
          userId={userId}
          loggedInUserDocId={loggedInUserDocId}
        />
      ))}
    </div>
  ) : null;
};

export default Suggestions;
