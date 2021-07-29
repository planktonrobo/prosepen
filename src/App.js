import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoggedInUserContext from "./context/logged-in-user";
import UserContext from "./context/user";
import useAuthListener from "./hooks/use-auth-listener";
import useUser from "./hooks/use-user";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

const Draft = lazy(() => import("./components/Editor/Draft"));
const Login = lazy(() => import("./components/Login/Login"));
const DraftsPage = lazy(() => import("./components/DraftsPage/DraftsPage"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const Piece = lazy(() => import("./components/Piece/Piece"));
const Profile = lazy(() => import("./components/Profile/Profile"));
const NotFound = lazy(() => import("./components/NotFound/NotFound"));
const Featured = lazy(() => import("./components/Featured/Featured"));

function App() {
  const { user } = useAuthListener();
  const didInvalidate = useSelector((state) => state.posts.didInvalidate);
  const userfire = useUser(user, didInvalidate);

  return (
    <UserContext.Provider value={{ user }}>
      <LoggedInUserContext.Provider value={{ userfire }}>
        <Router>
          <Suspense
            fallback={
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "85vh" }}
              >
                <Spinner animation="grow" />
              </div>
            }
          >
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/drafts" component={DraftsPage} />
              <Route exact path="/featured" component={Featured} />
              <Route exact path="/p/:username" component={Profile} />
              <Route exact path="/drafts/:docId" component={Draft} />
              <Route
                exact
                path="/:username/:title/:PiecedocId"
                component={Piece}
              />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Router>
      </LoggedInUserContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
