import { useState, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import FireBaseContext from "../../context/firebase";
import UserContext from "../../context/user";

const AddComment = ({
  docId,
  commentsState,
  setCommentsState,
  commentInput,
  picture,
  username,
  handleNotif,
}) => {
  const dateCreated = { seconds: Date.now() / 1000 };
  const [comment, setComment] = useState("");
  const { firebase, FieldValue } = useContext(FireBaseContext);
  const {
    user: { uid: userId },
  } = useContext(UserContext);
  async function handleSubmitComment(event) {
    event.preventDefault();
    setCommentsState([
      { username, picture, comment, dateCreated, userId },
      ...commentsState,
    ]);
    setComment("");
    const type = "comment";
    await handleNotif(userId, type, comment);
    return firebase
      .firestore()
      .collection("pieces")
      .doc(docId)
      .update({
        comments: FieldValue.arrayUnion({ userId, comment, dateCreated }),
      });
  }
  return (
    <div className="d-flex text-left align-items-center pb-3">
      <img
        src={picture}
        alt={username}
        style={{ width: 36, height: 36 }}
        className="mr-2 ml-md-1 ml-lg-0 rounded-circle"
      />
      <Form
        className="w-100"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1 ? handleSubmitComment : event.preventDefault()
        }
      >
        <InputGroup>
          <Form.Control
            style={{ boxShadow: "none" }}
            maxLength={280}
            size="sm"
            as="input"
            aria-label="Add a comment"
            autoComplete="off"
            className="border-0"
            type="text"
            name="add-comment"
            placeholder="Add a comment..."
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            ref={commentInput}
          />
          <InputGroup.Append>
            <Button
              disabled={comment.length < 1}
              type="submit"
              onClick={handleSubmitComment}
              className="rounded"
              size="sm"
            >
              Post
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    </div>
  );
};

export default AddComment;
