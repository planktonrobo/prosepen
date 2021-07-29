import { useContext, useState, useEffect } from "react";
import Header from "../Header/Header";
import LoggedInUserContext from "../../context/logged-in-user";
import UserContext from "../../context/user";
import { Container, Col, Spinner, Button } from "react-bootstrap";
import { useParams, Redirect } from "react-router-dom";
import useProfile from "../../hooks/use-profile";
import Following from "./Following";
import Timeline from "./Timeline";
import EditProfile from "./EditProfile";
import "./styles.scss";
import { createNotif } from "../../services/firebase";

const Profile = () => {
  const { username: usernameparam } = useParams();
  const { userfire } = useContext(LoggedInUserContext);
  const { user } = useContext(UserContext);
  const { user: { docId = "", username, fullName, picture, bio } = {} } = userfire;

  const { profile } = useProfile(usernameparam);
  async function handleNotif(type, pieceDocId = null, comment = null) {
    await createNotif(profile.userId, user.uid, pieceDocId, type, comment);
  }
  return profile === "loading" ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "85vh" }}
    >
      <Spinner animation="grow" />{" "}
    </div>
  ) : profile ? (
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
        <div className="row justify-content-center">
          <Col
            xs={12}
            md={4}
            className="order-md-2 px-md-0"
            style={{ position: "static" }}
          >
            <div className="sidebar2 ">
              <div className="d-flex align-items-center justify-content-start mt-md-3 ">
                <img
                  src={profile.picture}
                  alt={profile.picture}
                  style={{ width: 72, height: 72 }}
                  className="rounded-circle mr-2"
                />
                <div>
                  <h4 className="mb-1">{profile.fullName}</h4>
                  <span className="text-muted">@{profile.username}</span>
                </div>
              </div>

              {profile.bio ? (
                <div className="pt-2 px-1">{profile.bio}</div>
              ) : null}
              {user?.uid !== profile.userId ? (
                <Following
                  userFollows={
                    user && profile.followers.includes(user.uid) ? true : false
                  }
                  loggedInUserDocId={docId}
                  profileId={profile.userId}
                  user={user}
                  profileDocId={profile.docId}
                  handleNotif={handleNotif}
                />
              ) : (
                <EditProfile
                  docId={docId}
                  fullName={fullName}
                  username={username}
                  bio={bio}
                />
              )}
            </div>
          </Col>
          <Col
            xs={12}
            md={8}
            style={{ maxWidth: 650, position: "static" }}
            className="order-md-1 "
          >
            <Timeline
              profileUserId={profile.userId}
              user={user}
              handleNotif={handleNotif}
              onProf={profile.username}
            />
          </Col>
        </div>
      </Container>
    </>
  ) : (
    <Redirect to="/not-found" />
  );
};

export default Profile;
