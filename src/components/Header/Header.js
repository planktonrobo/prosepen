import { useContext, useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  Image,
  OverlayTrigger,
  Popover,
  Button,
  ListGroup,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../../context/firebase";
import {
  BsBoxArrowLeft,
  BsPaperclip,
  BsPencilSquare,
  BsPersonFill,
} from "react-icons/bs";
import useDocumentScrollThrottled from "../../hooks/use-document-scroll";
import "./styles.scss";
import Notifications from "./Notifications";
import { HashLink } from "react-router-hash-link";
import { useDispatch } from "react-redux";
import { invalidateCategory } from "../../redux/actions/posts";
import { newDraft } from "../../services/writing";

const Header = ({ user, username, picture }) => {
  const { auth, firebase } = useContext(FirebaseContext);
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const [shouldShowShadow, setShouldShowShadow] = useState(false);
  const history = useHistory();
  const MINIMUM_SCROLL = 20;
  const TIMEOUT_DELAY = 100;

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
  const dispatch = useDispatch();
  async function handleSignOut() {
    await auth.signOut();
    dispatch(invalidateCategory());
  }
  async function handleWrite() {
    newDraft(user?.uid).then(function (docRef) {
      history.push(`/drafts/${docRef.id}`);
      // make a firebase function to create a new document and then push to a route with drafts/docID
    });
  }
  return (
    <header className={`header ${shadowStyle}`}>
      <Container className="container-smooth d-flex align-items-center justify-content-between">
        <HashLink to="/#">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/prose-pen.appspot.com/o/1Asset%2015%40130x.png?alt=media&token=ed15d590-3a79-439a-90de-1a1c33bcded0"
            className="d-inline-block "
            alt="prosepen"
          />
        </HashLink>
        <Navbar className="p-0">
          <Nav className="">
            {user ? (
              <>
                <Button
                  variant="none"
                  className="nav-link pt-0"
                  onClick={handleWrite}
                >
                  <h4 className="d-inline">
                    <BsPencilSquare />
                  </h4>
                </Button>

                <Notifications firebase={firebase} userId={user.uid} />

                <OverlayTrigger
                  trigger="click"
                  placement="bottom-end"
                  rootClose={true}
                  style={{ positon: "static" }}
                  overlay={
                    <Popover
                      style={{ width: 400, positon: "static" }}
                      id={`popover-positioned-bottom`}
                    >
                      <Popover.Title as="h3">@{username}</Popover.Title>
                      <Popover.Content className="p-0">
                        <ListGroup variant="flush">
                          <ListGroup.Item action>
                            <Link
                             className="d-flex align-items-center text-dark"
                             to={`/p/${username}`}
                            >
                              <h6
                                style={{ display: "inline" }}
                                className="px-2 mb-0"
                              >
                                <BsPersonFill />
                              </h6>
                              <span>Profile</span>
                            </Link>
                          </ListGroup.Item>
                          <ListGroup.Item action>
                            <Link to="/drafts"
                              className="d-flex align-items-center text-dark"
                            >
                              <h6
                                style={{ display: "inline" }}
                                className="px-2 mb-0"
                              >
                                <BsPaperclip />
                              </h6>
                              Drafts
                            </Link>
                          </ListGroup.Item>
                          <ListGroup.Item action>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={handleSignOut}
                              className="d-flex align-items-center"
                            >
                              <h6
                                style={{ display: "inline" }}
                                className="px-2 mb-0"
                              >
                                <BsBoxArrowLeft />
                              </h6>
                              Sign Out
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <div className="d-flex align-items-center py-0 ">
                    <Image
                      className="rounded-circle mb-1 "
                      style={{
                        width: "32px",
                        height: "32px",
                        cursor: "pointer",
                      }}
                      src={picture}
                      alt={username}
                    />
                  </div>
                </OverlayTrigger>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">
                  <Button variant="outline-dark" className="my-0 mx-2">
                    Login
                  </Button>
                </Link>{" "}
              </>
            )}
          </Nav>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
