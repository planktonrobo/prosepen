import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useDraft from "../../hooks/use-draft";
import Editor from "./Editor";
import { Redirect } from "react-router-dom";
const Draft = () => {
  const { docId } = useParams();
  const { piece } = useDraft(docId);
  return piece === "loading" ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "85vh" }}
    >
      <Spinner animation="grow" />{" "}
    </div>
  ) : piece ? (
    <div>
      <Editor piece={piece} docId={docId}/>
    </div>
  ) : (
    <Redirect to="/not-found" />
  );
};

export default Draft;
