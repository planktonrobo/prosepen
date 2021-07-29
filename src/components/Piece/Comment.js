import { BsChat } from "react-icons/bs";
import { Button } from "react-bootstrap";

const Comment = ({ comments, handleFocus }) => {
  return (
    <Button
      variant="none p-0"
      onClick={handleFocus}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleFocus();
        }
      }}
    >
      <BsChat />
    </Button>
  );
};

export default Comment;
