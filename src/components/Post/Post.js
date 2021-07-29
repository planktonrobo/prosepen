import { Badge } from "react-bootstrap";
import Like from "./Like";
import Comment from "./Comment";
import Bookmark from "./Bookmark";
import LinkButton from "./LinkButton";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import { createNotif } from "../../services/firebase";
import { formatDistance } from "date-fns";

const Post = ({ content, selectedCategory }) => {
  async function handleNotif(loggedInUser, type, comment) {
    await createNotif(
      content.userId,
      loggedInUser,
      content.docId,
      type,
      comment
    );
  }
  const ya =
    selectedCategory === "FollowingNew" ||
    selectedCategory === "FollowingPopular" ||
    selectedCategory === "AllPopular" ||
    selectedCategory === "AllNew"
      ? true
      : false;
  return (
    <div className="media pt-2 my-3 " style={{ maxWidth: 550 }}>
      <Link to={`/p/${content.username}`}>
        <img
          src={content.picture}
          alt={content.username}
          style={{ width: 48 }}
          className="mr-3 ml-md-1 ml-lg-0 rounded-circle"
        />
      </Link>
      <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
        <div className=" ">
          <Link
            to={`/${content.username}/${slugify(content.title)}/${
              content.docId
            }`}
            className="text-dark"
          >
            <h4 style={{ display: "inline" }}>{content.title}</h4>
          </Link>
        </div>
        <span className="text-muted">
          <strong>
            <Link to={`/p/${content.username}`} className="text-muted">
              @{content.username}
            </Link>
          </strong>
          ・
          <span className="pr-1">
            {`${formatDistance(
              content.dateCreated["seconds"] * 1000,
              Date.now()
            )} ago`}
          </span>
          <div style={{ display: "inline-block" }}>
            {ya && (
              <Badge className="mx-1" variant="light">
                {content.category}
              </Badge>
            )}
            {content.tags &&
              content.tags.map((tag, i) => (
                <Badge key={i} className="mr-1" variant="light">
                  {tag}
                </Badge>
              ))}
          </div>
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
            handleNotif={handleNotif}
          />
          <Bookmark
            bookmarkedPiece={content.userBookmarkedPiece}
            docId={content.docId}
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
