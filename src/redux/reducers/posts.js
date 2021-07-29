import produce from "immer";

import {
  SELECT_CATEGORY,
  INVALIDATE_CATEGORY,
  REQUEST_POSTS,
  REQUEST_MORE_POSTS,
  RECEIVE_POSTS,
  TOGGLE_LIKE,
  TOGGLE_BOOKMARK,
} from "../actions/types";

function selectedCategory(state = "", action) {
  switch (action.type) {
    case SELECT_CATEGORY:
      return {
        selectedCategory: action.active.concat(action.filter),
        active: action.active,
        filter: action.filter,
      };
    default:
      return state;
  }
}

function posts(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_CATEGORY:
      return { items: [], didInvalidate: true };
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    case REQUEST_MORE_POSTS:
      return {
        ...state,
        isFetchingMore: true,
        didInvalidate: false,
      };
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        isFetchingMore: false,
        didInvalidate: false,
        items: state.items.concat(action.posts),
        lastUpdated: action.receivedAt,
        after: action.after,
      };

    default:
      return state;
  }
}

function postsByCategory(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_CATEGORY:
      return {};
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return {
        ...state,
        [action.active.concat(action.filter)]: posts(
          state[action.active.concat(action.filter)],
          action
        ),
      };
    case TOGGLE_LIKE:
      const likeDraft = produce(state, draft => {
        function myfunction(item) {
          if (item.docId === action.docId) {
            item.userLikedPiece = !item.userLikedPiece;
            const index = item.likes.indexOf(action.uid);
            !item.userLikedPiece
              ? item.likes.splice(index, 1)
              : item.likes.push(action.uid);
          }
        }
        for (const cat in draft) {
          draft[cat].items.map((item)=> myfunction(item));
        }

        
      });

      return likeDraft;
    case TOGGLE_BOOKMARK:
      const wineGlass = produce(state, (draft) => {
        for (const cat in draft) {
          draft[cat].items.forEach(handleBookmark);
        }

        function handleBookmark(item) {
          if (item.docId === action.docId) {
            item.userBookmarkedPiece = !item.userBookmarkedPiece;
            const index = item.likes.indexOf(action.uid);
            !item.userBookmarkedPiece
              ? item.bookmarks.splice(index, 1)
              : item.bookmarks.push(action.uid);
          }
        }
      });
      return wineGlass;
    default:
      return state;
  }
}
export { selectedCategory, posts, postsByCategory };
