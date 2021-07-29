import { combineReducers } from "redux";
import { posts, selectedCategory, postsByCategory } from "./posts";

export default combineReducers({
  posts,
  selectedCategory,
  postsByCategory,
});
