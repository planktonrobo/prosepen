import { useContext } from "react";
import { Card, Row, Col, Image, Container } from "react-bootstrap";
import EmailLogin from "./EmailLogin";
import FireBaseContext from "../../context/firebase";
import { Redirect, Link } from "react-router-dom/cjs/react-router-dom.min";

const Login = () => {
  const { firebase, auth } = useContext(FireBaseContext);
  if (auth.currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center "
      style={{ minHeight: "80vh", overflowX: "hidden" }}
    >
      <Row className="align-items-center">
        <Col className="mx-4">
          <Row className="justify-content-center py-3">
            <Link to="/">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/prose-pen.appspot.com/o/200.png?alt=media&token=e401cb22-7e7f-4d22-ab84-fdd74557d109"
              />
            </Link>
          </Row>
        </Col>
        <Col className="mx-4 ">
          <Row className=" justify-content-center ">
            <Card style={{ width: "19rem" }}>
              <Card.Body>
                <EmailLogin auth={auth} firebase={firebase} />
              </Card.Body>
            </Card>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
