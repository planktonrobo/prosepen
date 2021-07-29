import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import useComments from "../../hooks/use-comments";
import AddComment from "./AddComment";
import { BsTrash } from "react-icons/bs";
import { deleteComment } from "../../services/firebase";
const CommentSection = ({
  handleNotif,
  picture,
  username,
  docId,
  comments: allComments,
  commentInput,
  handleDate,
  user,
  pieceUsername,
}) => {
  const { comments } = useComments(allComments);
  const [commentsState, setCommentsState] = useState(comments);
  const [commentsSlice, setCommentsSlice] = useState(3);
  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  async function handleDelete(uid, comment, date) {
    setCommentsState((commentsState) =>
      commentsState.filter(
        (item) =>
          `${item.userId}-${item.comment}-${item.dateCreated["seconds"]}` !==
          `${uid}-${comment}-${date.seconds}`
      )
    );
    deleteComment(uid, comment, date, docId);
  }

  useEffect(() => {
    setCommentsState(!comments ? comments : comments.reverse());
  }, [comments]);

  return (
    commentsState && (
      <>
        <hr />
        <h5 id={"comments"} style={{}} className="text-left pt-3 ">
          Comments ({commentsState.length})
        </h5>
        <div className="pb-3 text-left">
          {commentsState.slice(0, commentsSlice).map((item) => (
            <div
              className="media pt-2 my-2"
              key={`${item.comment}-${item.username}-${item.dateCreated["seconds"]}`}
            >
              <Link to={`/p/${item.username}`}>
                <img
                  src={item.picture}
                  alt={item.username}
                  style={{ width: 36 }}
                  className="mr-2 ml-md-1 ml-lg-0 rounded-circle"
                />
              </Link>
              <div className="media-body">
                <p className="d-flex mb-1 align-items-center">
                  <Link to={`/p/${item.username}`}>
                    <span className="mr-1 font-weight-bold text-dark small">
                      @{item.username}
                    </span>
                  </Link>
                  <span className="text-muted small ml-1 w-100">
                    {handleDate(item.dateCreated)}
                  </span>
                </p>

                <div className="small">{item.comment}</div>
              </div>
              {item.username === username || username === pieceUsername ? (
                <span>
                  <Button
                    onClick={() =>
                      handleDelete(
                        item.userId,
                        item.comment,
                        item.dateCreated,
                        item.userId
                      )
                    }
                    size="sm"
                    className="py-0"
                    variant="none"
                  >
                    <BsTrash />
                  </Button>
                </span>
              ) : null}
            </div>
          ))}

          {commentsState.length >= 3 && commentsSlice < commentsState.length && (
            <Button
              size="sm"
              variant="none"
              className="text-muted"
              onClick={showNextComments}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  showNextComments();
                }
              }}
            >
              View more comments
            </Button>
          )}
        </div>
        {user && (
          <AddComment
            docId={docId}
            commentsState={commentsState}
            setCommentsState={setCommentsState}
            commentInput={commentInput}
            picture={picture}
            username={username}
            handleNotif={handleNotif}
          />
        )}
      </>
    )
  );
};

export default CommentSection;
