import Categories from "./Categories";
import Suggestions from "./Suggestions";
import "./styles.scss";

const Sidebar = ({ user, following, userId, docId }) => {
  return (
    <div className="sidebar">
      <Categories user={user} following={following} userId={userId} />

      {user && (
        <Suggestions
          userId={userId}
          following={following}
          loggedInUserDocId={docId}
        />
      )}
    </div>
  );
};

export default Sidebar;
