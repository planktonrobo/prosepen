import { useParams, useHistory, Redirect, Link } from "react-router-dom";
import { Badge, Container, Spinner } from "react-bootstrap";
import VanishingHeader from "./VanishingHeader";
import "./styles.scss";
import usePiece from "../../hooks/use-single-piece";
import Like from "./Like";
import UserContext from "../../context/user";
import LoggedInUserContext from "../../context/logged-in-user";
import { useContext, useRef } from "react";
import Bookmark from "./Bookmark";
import Comment from "./Comment";
import LinkButton from "../Post/LinkButton";
import CommentSection from "./CommentSection";
import { handleDate } from "../../helpers";
import { createNotif } from "../../services/firebase";
import slugify from "react-slugify";
import ContentShit from "./ContentShit";

const Piece = () => {
  const commentInput = useRef();
  const history = useHistory();
  const { user } = useContext(UserContext);
  const handleFocus = () =>
    user ? commentInput.current.focus() : history.push("/login");
  const { PiecedocId } = useParams();
  const { piece } = usePiece(PiecedocId);
  const { userfire } = useContext(LoggedInUserContext);
  const { user: { docId = "", username, fullName, picture } = {} } = userfire;
  async function handleNotif(loggedInUser, type, comment) {
    const docc = type !== "follow" ? piece.docId : null;
    await createNotif(piece.userId, loggedInUser, docc, type, comment);
  }
  return piece === "loading" ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "85vh" }}
    >
      <Spinner animation="grow" />{" "}
    </div>
  ) : piece ? (
    <div className="wrapper mb-5">
      <VanishingHeader
        loggedInUserDocId={docId}
        picture={piece.picture}
        username={piece.username}
        userFollows={piece.userFollows}
        profileId={piece.userId}
        user={user}
        profileDocId={piece.profileDocId}
        handleNotif={handleNotif}
        PiecedocId={PiecedocId}
        title={piece.title}
        fullName={fullName}
      />
      <Container
        style={{
          paddingTop: 80,
          padding: "80px auto auto",
          minHeight: "100vh",
          maxWidth: 700,
        }}
      >
        <div className=" text-left py-3 ">
          <h1 style={{ display: "inline" }}>{piece.title}</h1>
          <div className="small" >
            <Badge className="mr-1" variant="light">{piece.category}</Badge>
            {piece.tags &&
              piece.tags.map((tag, i) => (
                <Badge key={i} className="mx-1" variant="light">
                  {tag}
                </Badge>
              ))}
          </div>

          <div className="d-flex align-items-center " style={{ maxWidth: '100%' }}>
            <small>
              <Link className="text-dark" to={`/${piece.username}`}>
                {piece.fullName}
              </Link>{" "}
              · {handleDate(piece.dateCreated)}
            </small>
            <LinkButton
              link={`${window.location.host}/${piece.username}/${slugify(
                piece.title
              )}/${piece.docId}`}
            />
          </div>
          <div>
            <Comment handleFocus={handleFocus} comments={piece.comments} />
            <Like
              likecount={piece.likes.length}
              likedPiece={piece.userLikedPiece}
              docId={piece.docId}
              user={user}
              handleNotif={handleNotif}
            />
            <Bookmark
              bookmarkedPiece={piece.userBookmarkedPiece}
              docId={piece.docId}
              user={user}
            />
          </div>
        </div>
        
        <ContentShit content={piece.content} />
        <CommentSection
          handleNotif={handleNotif}
          docId={piece.docId}
          comments={piece.comments}
          posted={piece.dateCreated}
          commentInput={commentInput}
          handleDate={handleDate}
          user={user}
          pieceUsername={piece.username}
          picture={picture}
          username={username}
        />
      </Container>
    </div>
  ) : (
    <Redirect to="/not-found" />
  );
};

export default Piece;
