import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    document.title = "Not Found - ProsePen";
  }, []);
  return (
    <div className="p-2">
      <h6>
        Not Found! <Link to="/">Home</Link>
      </h6>
    </div>
  );
};

export default NotFound;
