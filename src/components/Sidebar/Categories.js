import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { selectCategory, fetchPostsIfNeeded } from "../../redux/actions/posts";

const Categories = ({ user, userId, following }) => {
  const [active, setActive] = useState(user ? "Following" : "All");
  const [filter, setFilter] = useState(user ? "New" : "Popular");
  const dispatch = useDispatch();

  useEffect(() => {
    if (following?.length > 0 || active !== "Following") {
      dispatch(fetchPostsIfNeeded(active, filter, following, user?.uid));
      dispatch(selectCategory(active, filter));
    }
  }, [active, filter, dispatch, following, user]);

  useEffect(() => {
    if (!user) {
      setActive("All");
      setFilter("Popular");
    }
  }, [user]);

  return (
    <div>
      <h4>Categories</h4>
      {user && (
        <Button
          variant={active === "Following" ? "dark" : "outline-dark"}
          className="m-1 responsive"
          key="Following"
          onClick={() => setActive("Following")}
        >
          Following
        </Button>
      )}
      {["All", "Poetry", "Short Stories", "Journals", "Essays"].map(
        (direction) => (
          <Button
            variant={active === direction ? "dark" : "outline-dark"}
            className="m-1 responsive"
            key={direction}
            onClick={() => setActive(direction)}
          >
            {direction}
          </Button>
        )
      )}
      <div style={{ display: "inline-block" }}>
        {["Popular", "New"].map((direction) => (
          <Button
            variant={filter === direction ? "secondary" : "outline-secondary"}
            className="m-1 responsive rounded "
            key={direction}
            onClick={() => setFilter(direction)}
          >
            {direction}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
