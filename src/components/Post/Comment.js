import { BsChat } from "react-icons/bs";
import { Button } from "react-bootstrap";

const Comment = ({ comments }) => {
  return (
    <Button variant="none">
      <BsChat /> <span className="small text-muted">{comments.length > 0 && comments.length}</span>
    </Button>
  );
};

export default Comment;
