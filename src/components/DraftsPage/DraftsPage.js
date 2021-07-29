import { useContext } from "react";
import Header from "../Header/Header";
import UserContext from "../../context/user";
import LoggedInUserContext from "../../context/logged-in-user";
import { Container, Spinner } from "react-bootstrap";
import Deck from "./Deck";
import useDrafts from '../../hooks/use-draft-list'

const DraftsPage = () => {
  const { user } = useContext(UserContext);
  const { userfire } = useContext(LoggedInUserContext);
  const { user: { username, picture } = {} } = userfire;
  const {drafts} = useDrafts(user)
  return (
    <>
      <Header user={user} picture={picture} username={username} />
      <Container
        className="container-smooth "
        style={{
          paddingTop: 80,
          padding: "80px auto auto",
          minHeight: "100vh",
        }}
      >
          <div className="p-1">
          <h1>Drafts</h1>
          { drafts==='loading' ? <div className="d-flex mt-5 h-100 justify-content-center align-items-center">
          <Spinner animation="grow" />
        </div>: drafts?.length > 0 ?
          <Deck user={user} drafts={drafts}/> : <div className="d-flex mt-5 h-100 justify-content-center align-items-center">Nothing here yet!</div>}
          </div>
      </Container>
    </>
  );
};

export default DraftsPage;
