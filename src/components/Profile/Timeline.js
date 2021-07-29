import useProfilePieces from "../../hooks/use-profile-pieces";
import { Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import Post from "./Post";
import { useEffect } from "react";
const Timeline = ({ profileUserId, user, onProf }) => {
  const { pieces } = useProfilePieces(profileUserId);
  function handleLoad() {
    console.log("more");
  }
  useEffect(() => {
    document.title = `${onProf} - prosepen`;
  }, []);

  return pieces === "loading" ? (
    <div className="d-flex mt-5 h-100 justify-content-center align-items-center">
      <Spinner animation="grow" />
    </div>
  ) : pieces ? (
    <InfiniteScroll
      loadMore={handleLoad}
      hasMore={false}
      loader={
        <div
          key={0}
          className="d-flex h-100 justify-content-center align-items-center"
        >
          <Spinner animation="grow" />
        </div>
      }
    >
      {pieces.piecesWithUserDetails.map((content) => (
        <Post key={content.docId} content={content} user={user} />
      ))}
    </InfiniteScroll>
  ) : (
    <div className="d-flex justify-content-center mt-5 ">
      <h6>
        This user has no posts yet!
      </h6>
    </div>
  );
};

export default Timeline;
