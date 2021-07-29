import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import useDocumentScrollThrottled from "../../hooks/use-document-scroll";
import { useHistory, Link } from "react-router-dom";
import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
} from "../../services/firebase";
import { BsHouse } from "react-icons/bs";
import { UnpublishDraft } from "../../services/writing";
const VanishingHeader = ({
  picture,
  title,
  fullName,
  username,
  userFollows,
  user,
  loggedInUserDocId,
  profileDocId,
  profileId,
  handleNotif,
  PiecedocId,
}) => {
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const [shouldShowShadow, setShouldShowShadow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(userFollows);
  const history = useHistory();
  const MINIMUM_SCROLL = 20;
  const TIMEOUT_DELAY = 200;

  useDocumentScrollThrottled((callbackData) => {
    const { previousScrollTop, currentScrollTop } = callbackData;
    const isScrolledDown = previousScrollTop < currentScrollTop;
    const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

    setShouldShowShadow(currentScrollTop > 2);

    setTimeout(() => {
      setShouldHideHeader(isScrolledDown && isMinimumScrolled);
    }, TIMEOUT_DELAY);
  });

  const shadowStyle = shouldShowShadow ? "shadow" : "";
  const hiddenStyle = shouldHideHeader ? "hidden" : "";

  async function handleFollow() {
    if (!user) {
      history.push("/login");
    } else {
      setFollowing((following) => !following);
      await updateLoggedInUserFollowing(
        loggedInUserDocId,
        profileId,
        following
      );

      await updateFollowedUserFollowers(profileDocId, user.uid, following);
      const type = "follow";
      following && (await handleNotif(user.uid, type));
    }
  }

  async function handleUnpub() {
    setLoading(true);
    await UnpublishDraft(PiecedocId);
    setTimeout(() => {
      history.push(`/drafts/${PiecedocId}`);
    }, 200);
  }

  useEffect(() => {
    document.title = `${title} - ${fullName}`;
  }, [fullName, title]);

  return (
    <header className={`header ${shadowStyle} ${hiddenStyle}`}>
      <Container
        className=" d-flex align-items-center justify-content-between"
        style={{ maxWidth: 700 }}
      >
        <div>
          <Link to={`/p/${username}`}>
            <img
              src={picture}
              className="rounded-circle mr-2"
              style={{ maxWidth: 48, maxHeight: 48 }}
              alt={username}
            />
          </Link>
          <Link className="text-dark" to={`/p/${username}`}>
            <strong>@{username}</strong>
          </Link>
        </div>

        <div className="d-flex align-items-center ">
          <Link className="pr-3 text-dark" to="/">
            <h4 style={{ display: "inline-block" }}>
              <BsHouse />
            </h4>
          </Link>
          {user?.uid !== profileId ? (
            <Button onClick={handleFollow} variant="outline-dark">
              {following ? "Following ✓" : "Follow"}
            </Button>
          ) : (
            <Button onClick={handleUnpub} variant="outline-dark">
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Unpublish"
              )}
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
};

export default VanishingHeader;
