import { useState } from "react";
import useDocumentScrollThrottled from "../../hooks/use-document-scroll";
import { Link } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import { Container } from "react-bootstrap";
import PublishButton from "./PublishButton";
const EditorHeader = ({ saving, title, docId }) => {
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const [shouldShowShadow, setShouldShowShadow] = useState(false);
  const MINIMUM_SCROLL = 20;
  const TIMEOUT_DELAY = 200;

  useDocumentScrollThrottled((callbackData) => {
    const { previousScrollTop, currentScrollTop } = callbackData;
    const isScrolledDown = previousScrollTop < currentScrollTop;
    const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

    setShouldShowShadow(currentScrollTop > 2);

    setTimeout(() => {
      setShouldHideHeader(isScrolledDown && isMinimumScrolled);
    }, TIMEOUT_DELAY);
  });

  const shadowStyle = shouldShowShadow ? "shadow" : "";
  const hiddenStyle = shouldHideHeader ? "hidden" : "";
  return (
    <header className={`header ${shadowStyle} ${hiddenStyle} `}>
      <Container
        className=" d-flex align-items-center justify-content-between"
        style={{ maxWidth: 700 }}
      >
        <div>
          {saving ? (
            <span className="text-muted">
              Saving to{" "}
              <Link className="text-muted" to="/drafts">
              <span style={{textDecoration: 'underline'}}>Drafts</span>
              </Link>
              ...
            </span>
          ) : (
            <span className="text-muted">
              Saved to{" "}
              <Link className="text-muted" to="/drafts">
                <span style={{textDecoration: 'underline'}}>Drafts</span>
              </Link>{" "}
              ✓
            </span>
          )}
        </div>

        <div className="d-flex align-items-center ">
          <Link className="pr-3 text-dark" to="/">
            <h4 style={{ display: "inline-block" }}>
              <BsHouse />
            </h4>
          </Link>
          <PublishButton docId={docId} title={title} saving={saving}/>
        </div>
      </Container>
    </header>
  );
};

export default EditorHeader;
