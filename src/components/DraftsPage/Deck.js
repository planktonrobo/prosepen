import { formatDistance } from "date-fns";
import { useState } from "react";
import { CardGroup, Card } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getPTags, shortenHTML } from "../../helpers";
import { decimateDraft } from "../../services/writing";

const Deck = ({ drafts }) => {
  const [draftState, setDraftState] = useState(drafts);
  async function deleteDraft(docId) {
      setDraftState((draftState)=> draftState.filter((draft) => draft.docId !== docId))
      await decimateDraft(docId)
  }
  return (
    <div className="row justify-content-center justify-content-md-start">
      <CardGroup>
        {draftState && draftState.map((draft) => (
          <div key={draft.docId} className="col px-1 mx-1 py-3">
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Link
                  to={`/drafts/${draft.docId}`}
                  className="text-dark text-decoration-none"
                >
                  <Card.Title> {draft.title || "Untitled"}</Card.Title>{" "}
                </Link>
                <Card.Subtitle className="mb-2 text-muted">
                  <small>
                    Last updated{" "}
                    {formatDistance(
                      draft.lastUpdated.seconds * 1000,
                      Date.now()
                    )}{" "}
                    ago
                  </small>
                </Card.Subtitle>
                {draft.content !== "<p></p>" && (
                  <Card.Text style={{ display: "inline" }}>
                    <small>
                      {" "}
                      {draft.content && <i>
                        {shortenHTML(getPTags(draft.content))}...
                      </i>} {" "}
                    </small>
                  </Card.Text>
                )}
                <div className="my-0 d-flex justify-content-end">
                  <span>
                    <button onClick={()=>deleteDraft(draft.docId)} className="btn pt-0 btn-none">
                      <BsTrash />
                    </button>
                  </span>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}{" "}
      </CardGroup>
    </div>
  );
};

export default Deck;
