import { FieldValue, firebase } from "../firebaseconfig";
import store from "../redux/store";
import { invalidateCategory } from "../redux/actions/posts";
export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username.trim().toLowerCase())
    .get();
  const it = result.docs.map((user) => user.data());
  return it.length > 0 ? true : false;
}

export async function getUserByUserId(uid) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", uid)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
  return user;
}

export async function getUserbyUsername(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function getSuggestedProfiles(userId, following) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("featured", "==", true)
    .limit(10)
    .get();

  return result.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    );
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId,
  profileId,
  isFollowingProfile
) {
  const result = await firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
  store.dispatch(invalidateCategory());
  return result;
}

export async function updateFollowedUserFollowers(
  profileDocId, // currently logged in user doc id
  loggedInUserDocId, // the user that I request to follows
  isFollowingProfile // true/false {am i currently following this person?}
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId),
    });
}

export async function getFollowingPieces(userId, following, filter) {
  const order = filter === "Popular" ? "likeCount" : "dateCreated";
  const result = await firebase
    .firestore()
    .collection("pieces")
    .where("userId", "in", following.slice(0, 10))
    .where("published", "==", true)
    .orderBy(order, "desc")
    .limit(10)
    .get();
  const last = result.docs[result.docs.length - 1];
  const userFollowedPieces = result.docs.map((piece) => ({
    ...piece.data(),
    docId: piece.id,
  }));

  const piecesWithUserDetails = await Promise.all(
    userFollowedPieces.map(async (piece) => {
      let userLikedPiece = false;
      let userBookmarkedPiece = false;
      if (piece.likes.includes(userId)) {
        userLikedPiece = true;
      }
      if (piece.bookmarks.includes(userId)) {
        userBookmarkedPiece = true;
      }
      const user = await getUserByUserId(piece.userId);
      const { username, picture, fullName } = user[0];
      return {
        username,
        picture,
        fullName,
        ...piece,
        userLikedPiece,
        userBookmarkedPiece,
      };
    })
  );
  return { piecesWithUserDetails, last };
}

export async function getCategoryPieces(active, filter, userId = "") {
  const order = filter === "Popular" ? "likeCount" : "dateCreated";
  const result = await firebase
    .firestore()
    .collection("pieces")
    .where("published", "==", true)
    .where("category", "==", active)
    .orderBy(order, "desc")
    .limit(10)
    .get();
  const last = result.docs[result.docs.length - 1];
  const userFollowedPieces = result.docs.map((piece) => ({
    ...piece.data(),
    docId: piece.id,
  }));

  const piecesWithUserDetails = await Promise.all(
    userFollowedPieces.map(async (piece) => {
      let userLikedPiece = false;
      let userBookmarkedPiece = false;
      if (piece.likes.includes(userId)) {
        userLikedPiece = true;
      }
      if (piece.bookmarks.includes(userId)) {
        userBookmarkedPiece = true;
      }
      const user = await getUserByUserId(piece.userId);
      const { username, picture, fullName } = user[0];
      return {
        username,
        picture,
        fullName,
        ...piece,
        userLikedPiece,
        userBookmarkedPiece,
      };
    })
  );
  return { piecesWithUserDetails, last };
}

export async function getAllPublishedPieces(filter, userId = "") {
  const order = filter === "Popular" ? "likeCount" : "dateCreated";
  const result = await firebase
    .firestore()
    .collection("pieces")
    .where("published", "==", true)
    .orderBy(order, "desc")
    .limit(10)
    .get();
  const last = result.docs[result.docs.length - 1];
  const userFollowedPieces = result.docs.map((piece) => ({
    ...piece.data(),
    docId: piece.id,
  }));

  const piecesWithUserDetails = await Promise.all(
    userFollowedPieces.map(async (piece) => {
      let userLikedPiece = false;
      let userBookmarkedPiece = false;
      if (piece.likes.includes(userId)) {
        userLikedPiece = true;
      }
      if (piece.bookmarks.includes(userId)) {
        userBookmarkedPiece = true;
      }

      const user = await getUserByUserId(piece.userId);
      const { username, picture, fullName } = user[0];
      return {
        username,
        picture,
        fullName,
        ...piece,
        userLikedPiece,
        userBookmarkedPiece,
      };
    })
  );
  return { piecesWithUserDetails, last };
}

// Get more Functions (should refactor so code is not repeated)

export async function getMoreFollowingPieces(userId, following, filter, after) {
  const order = filter === "Popular" ? "likeCount" : "dateCreated";
  const result = await firebase
    .firestore()
    .collection("pieces")
    .where("userId", "in", following.slice(0, 10))
    .where("published", "==", true)
    .orderBy(order, "desc")
    .startAfter(after)
    .limit(10)
    .get();
  const last = result.docs[result.docs.length - 1];
  const userFollowedPieces = result.docs.map((piece) => ({
    ...piece.data(),
    docId: piece.id,
  }));

  const piecesWithUserDetails = await Promise.all(
    userFollowedPieces.map(async (piece) => {
      let userLikedPiece = false;
      let userBookmarkedPiece = false;
      if (piece.likes.includes(userId)) {
        userLikedPiece = true;
      }
      if (piece.bookmarks.includes(userId)) {
        userBookmarkedPiece = true;
      }
      const user = await getUserByUserId(piece.userId);
      const { username, picture, fullName } = user[0];
      return {
        username,
        picture,
        fullName,
        ...piece,
        userLikedPiece,
        userBookmarkedPiece,
      };
    })
  );
  return { piecesWithUserDetails, last };
}

export async function getMoreCategoryPieces(
  active,
  filter,
  userId = "",
  after
) {
  const order = filter === "Popular" ? "likeCount" : "dateCreated";
  const result = await firebase
    .firestore()
    .collection("pieces")
    .where("published", "==", true)
    .where("category", "==", active)
    .orderBy(order, "desc")
    .startAfter(after)
    .limit(10)
    .get();
  const last = result.docs[result.docs.length - 1];
  const userFollowedPieces = result.docs.map((piece) => ({
    ...piece.data(),
    docId: piece.id,
  }));

  const piecesWithUserDetails = await Promise.all(
    userFollowedPieces.map(async (piece) => {
      let userLikedPiece = false;
      let userBookmarkedPiece = false;
      if (piece.likes.includes(userId)) {
        userLikedPiece = true;
      }
      if (piece.bookmarks.includes(userId)) {
        userBookmarkedPiece = true;
      }
      const user = await getUserByUserId(piece.userId);
      const { username, picture, fullName } = user[0];
      return {
        username,
        picture,
        fullName,
        ...piece,
        userLikedPiece,
        userBookmarkedPiece,
      };
    })
  );
  return { piecesWithUserDetails, last };
}

export async function getMoreAllPublishedPieces(filter, userId = "", after) {
  const order = filter === "Popular" ? "likeCount" : "dateCreated";
  const result = await firebase
    .firestore()
    .collection("pieces")
    .where("published", "==", true)
    .orderBy(order, "desc")
    .startAfter(after)
    .limit(10)
    .get();
  const last = result.docs[result.docs.length - 1];
  const userFollowedPieces = result.docs.map((piece) => ({
    ...piece.data(),
    docId: piece.id,
  }));

  const piecesWithUserDetails = await Promise.all(
    userFollowedPieces.map(async (piece) => {
      let userLikedPiece = false;
      let userBookmarkedPiece = false;
      if (piece.likes.includes(userId)) {
        userLikedPiece = true;
      }
      if (piece.bookmarks.includes(userId)) {
        userBookmarkedPiece = true;
      }

      const user = await getUserByUserId(piece.userId);
      const { username, picture, fullName } = user[0];
      return {
        username,
        picture,
        fullName,
        ...piece,
        userLikedPiece,
        userBookmarkedPiece,
      };
    })
  );
  return { piecesWithUserDetails, last };
}

export async function getSinglePiece(docId, userId = "") {
  const result = await firebase.firestore().doc(`pieces/${docId}`).get();

  const pieceResult = {
    ...result.data(),
    docId: result.id,
  };
  if (!result.data() || !result.data()?.published) {
    return null;
  } else {
    async function userFollowedPieces() {
      let userLikedPiece = false;
      let userBookmarkedPiece = false;
      let userFollows = false;
      if (pieceResult.likes.includes(userId)) {
        userLikedPiece = true;
      }
      if (pieceResult.bookmarks.includes(userId)) {
        userBookmarkedPiece = true;
      }
      const user = await getUserByUserId(pieceResult.userId);
      const {
        username,
        picture,
        fullName,
        followers,
        docId: profileDocId,
      } = user[0];
      if (followers.includes(userId)) {
        userFollows = true;
      }
      return {
        username,
        picture,
        fullName,
        ...pieceResult,
        userLikedPiece,
        userBookmarkedPiece,
        userFollows,
        profileDocId,
      };
    }
    return userFollowedPieces();
  }
}

export async function getCommentDetails(comments) {
  const commentdeets = await Promise.all(
    comments.map(async (comment) => {
      const user = await getUserByUserId(comment.userId);
      const { username, picture } = user[0];
      return { ...comment, username, picture };
    })
  );
  return { commentdeets };
}

export async function getNotifDetails(notifications) {
  const notifdeets = await Promise.all(
    notifications.map(async (notification) => {
      const user = await getUserByUserId(notification.from);
      const result = await firebase
        .firestore()
        .doc(`pieces/${notification.pieceId}`)
        .get();
      const piece = {
        ...result.data(),
      };
      const { username, picture } = user[0];
      return { ...notification, username, picture, ...piece };
    })
  );
  return { notifdeets };
}

export async function deleteComment(userId, comment, dateCreated, docId) {
  const obj = { userId, comment, dateCreated };
  return firebase
    .firestore()
    .collection("pieces")
    .doc(docId)
    .update({
      comments: FieldValue.arrayRemove(obj),
    });
}

export async function getUsernamePieces(userId, profileUserId) {
  const result = await firebase
    .firestore()
    .collection("pieces")
    .where("userId", "==", profileUserId)
    .where("published", "==", true)
    .orderBy("dateCreated", "desc")
    .limit(25)
    .get();
  const last = result.docs[result.docs.length - 1];
  const userFollowedPieces = result.docs.map((piece) => ({
    ...piece.data(),
    docId: piece.id,
  }));

  const piecesWithUserDetails = await Promise.all(
    userFollowedPieces.map(async (piece) => {
      let userLikedPiece = false;
      let userBookmarkedPiece = false;
      if (piece.likes.includes(userId)) {
        userLikedPiece = true;
      }
      if (piece.bookmarks.includes(userId)) {
        userBookmarkedPiece = true;
      }
      const user = await getUserByUserId(piece.userId);
      const { username, picture, fullName } = user[0];
      return {
        username,
        picture,
        fullName,
        ...piece,
        userLikedPiece,
        userBookmarkedPiece,
      };
    })
  );
  return { piecesWithUserDetails, last };
}
export async function getMoreUsernamePieces(userId, profileUserId, after) {
  const result = await firebase
    .firestore()
    .collection("pieces")
    .where("userId", "==", profileUserId)
    .orderBy("dateCreated", "desc")
    .startAfter(after)
    .limit(7)
    .get();
  const last = result.docs[result.docs.length - 1];
  const userFollowedPieces = result.docs.map((piece) => ({
    ...piece.data(),
    docId: piece.id,
  }));

  const piecesWithUserDetails = await Promise.all(
    userFollowedPieces.map(async (piece) => {
      let userLikedPiece = false;
      let userBookmarkedPiece = false;
      if (piece.likes.includes(userId)) {
        userLikedPiece = true;
      }
      if (piece.bookmarks.includes(userId)) {
        userBookmarkedPiece = true;
      }
      const user = await getUserByUserId(piece.userId);
      const { username, picture, fullName } = user[0];
      return {
        username,
        picture,
        fullName,
        ...piece,
        userLikedPiece,
        userBookmarkedPiece,
      };
    })
  );
  return { piecesWithUserDetails, last };
}
export async function updateImage(
  profileDocId, // currently logged in user doc id
  imageURL
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      picture: imageURL,
    })
    .catch((error) => console.log(error));
}

export async function updateFullName(
  profileDocId, // currently logged in user doc id
  fullname
) {
  return firebase.firestore().collection("users").doc(profileDocId).update({
    fullName: fullname,
  });
}

export async function updateBio(
  profileDocId, // currently logged in user doc id
  bio
) {
  return firebase.firestore().collection("users").doc(profileDocId).update({
    bio,
  });
}

export async function createNotif(
  to,
  from,
  pieceId,
  type,
  comment = null,
  read = false
) {
  if (to !== from) {
    firebase
      .firestore()
      .collection("notifications")
      .where("to", "==", to)
      .where("from", "==", from)
      .where("type", "==", type)
      .where("pieceId", "==", pieceId)
      .where("comment", "==", comment)
      .get()
      .then((result) => {
        const ref = result.docs.map((item) => item.data());
        if (ref.length === 0) {
          return firebase.firestore().collection("notifications").add({
            dateNoted: FieldValue.serverTimestamp(),
            to,
            from,
            pieceId,
            type,
            comment,
            read,
          });
        }
      });
  }
}

export async function getFeatured(userId, following) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("featured", "==", true)
    .limit(10)
    .get();

  return result.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    );
}
