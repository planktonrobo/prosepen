import { Badge } from "react-bootstrap";
import Like from "../Piece/Like";
import Comment from "../Post/Comment";
import Bookmark from "../Piece/Bookmark";
import LinkButton from "../Post/LinkButton";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import { handleDate } from "../../helpers";
import { createNotif } from "../../services/firebase";
const Post = ({ content, user }) => {
  async function handleNotif(loggedInUser, type, comment = null) {
    await createNotif(
      content.userId,
      loggedInUser,
      content.docId,
      type,
      comment
    );
  }
  return (
    <div className="media pt-2 my-3 " style={{ maxWidth: 550 }}>
      <div className="media-body pb-3 mb-0 lh-125 border-bottom border-gray ml-1">
        <div className=" ">
          <Link
            to={`/${content.username}/${slugify(content.title)}/${
              content.docId
            }`}
            className="text-dark"
          >
            <h3 style={{ display: "inline" }}>{content.title}</h3>
          </Link>
        </div>
        <span className="text-muted small">
          <span className="pr-1">{handleDate(content.dateCreated)}</span>
         <div style={{display: 'inline-block'}}> <Badge variant="light">{content.category}</Badge>{content.tags &&
              content.tags.map((tag, i) => (
                <Badge key={i} className="mx-1" variant="light">
                  {tag}
                </Badge>
              ))}</div>
        </span>
        {content.caption && (
          <div className="py-1 text-muted">
            <i>{content.caption}</i>
          </div>
        )}
        <div className="d-flex pr-3 justify-content-between">
          <HashLink
            to={`/${content.username}/${slugify(content.title)}/${
              content.docId
            }#comments`}
          >
            <Comment comments={content.comments} />
          </HashLink>
          <Like
            likecount={content.likes.length}
            likedPiece={content.userLikedPiece}
            docId={content.docId}
            user={user}
            handleNotif={handleNotif}
          />
          <Bookmark
            bookmarkedPiece={content.userBookmarkedPiece}
            docId={content.docId}
            user={user}
          />
          <LinkButton
            link={`${window.location.host}/${content.username}/${slugify(
              content.title
            )}/${content.docId}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Post;
