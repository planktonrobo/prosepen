import {
  REQUEST_POSTS,
  REQUEST_MORE_POSTS,
  RECEIVE_POSTS,
  SELECT_CATEGORY,
  INVALIDATE_CATEGORY,
  TOGGLE_LIKE,
  TOGGLE_BOOKMARK
} from "./types";
import { getFollowingPieces, getCategoryPieces, getAllPublishedPieces, getMoreFollowingPieces, getMoreCategoryPieces, getMoreAllPublishedPieces } from "../../services/firebase";
export function toggleBookmarked(uid, docId) {
  return {
    type: TOGGLE_BOOKMARK,
    uid,
    docId
 
  } 
}


export function toggleLiked(uid, docId) {
  return {
    type: TOGGLE_LIKE,
    uid,
    docId
 
  } 
}

export function selectCategory(active, filter) {
  return {
    type: SELECT_CATEGORY,
    active,
    filter,
  };
}

export function invalidateCategory() {
  return {
    type: INVALIDATE_CATEGORY,
    
  };
}

function requestPosts(active, filter) {
  return {
    type: REQUEST_POSTS,
    active,
    filter,
  };
}
function requestMorePosts(active, filter) {
  return {
    type: REQUEST_MORE_POSTS,
    active,
    filter,
  };
}

function receivePosts(active, filter, posts, last) {
  return {
    type: RECEIVE_POSTS,
    active,
    filter,
    posts: posts,
    after:last,
    receivedAt: Date.now(),
  };
}

export function fetchPosts(active, filter, following, userId) {
  return (dispatch) => {
    dispatch(requestPosts(active, filter, following, userId));
    if (active === "Following") {
      
        return getFollowingPieces(userId, following, filter).then(({piecesWithUserDetails, last}) =>
          dispatch(receivePosts(active, filter, piecesWithUserDetails, last))
        );
      
    } else if (active === "All") {
        return getAllPublishedPieces(filter, userId).then(({piecesWithUserDetails, last}) =>
          dispatch(receivePosts(active, filter,  piecesWithUserDetails, last))
        );
    } 
    
    else {
        return getCategoryPieces( active, filter, userId).then(({piecesWithUserDetails, last})=>
        dispatch(receivePosts(active, filter,  piecesWithUserDetails, last)))
    }
  };
}
export function fetchMorePosts(following, userId) {
  return (dispatch, getState) => {

    const state = getState()
    const active = state.selectedCategory.active
    const filter = state.selectedCategory.filter
    const selectedCategory = state.selectedCategory.selectedCategory
    const after = state.postsByCategory[selectedCategory].after

    dispatch(requestMorePosts(active, filter, following, userId));
    if (active === "Following") {
      
        return getMoreFollowingPieces(userId, following, filter, after).then(({piecesWithUserDetails, last}) =>
          dispatch(receivePosts(active, filter,  piecesWithUserDetails, last))
        );
      
    } else if (active === "All") {
        return getMoreAllPublishedPieces(filter, userId, after).then(({piecesWithUserDetails, last}) =>
          dispatch(receivePosts(active, filter,  piecesWithUserDetails, last))
        );
    } 
    
    else {
        return getMoreCategoryPieces( active, filter, userId, after).then(({piecesWithUserDetails, last})=>
        dispatch(receivePosts(active, filter,  piecesWithUserDetails, last)))
    }
  };
}


function shouldFetchPosts(state, active, filter) {
  const posts = state.postsByCategory[active.concat(filter)];
  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function fetchPostsIfNeeded(active, filter, following, uid) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), active, filter)) {
      return dispatch(fetchPosts(active, filter, following, uid));
    }
  };
}
