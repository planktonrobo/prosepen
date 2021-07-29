import { FieldValue, firebase } from "../firebaseconfig";
export async function newDraft(userId) {
  return await firebase.firestore().collection("pieces").add({
    userId,
    title: "",
    content: "",
    dateCreated: FieldValue.serverTimestamp(),
    published: false
  });
}

export async function getDraft(docId, userId = "") {
  const result = await firebase.firestore().doc(`pieces/${docId}`).get();

  const content = result.data();

  if (userId !== content?.userId || content?.published) {
    return null;
  } else {
    return content;
  }
}

export async function updateDraftContent(docId, content) {
  return await firebase.firestore().collection("pieces").doc(docId).update({
    content,
    lastUpdated: FieldValue.serverTimestamp(),
  });
}
export async function updateDraftTitle(docId, title) {
  return await firebase.firestore().collection("pieces").doc(docId).update({
    title,
    lastUpdated: FieldValue.serverTimestamp(),
  });
}

export async function publishDraft(docId, tags, category, caption) {
  return await firebase.firestore().collection("pieces").doc(docId).update({
    tags,
    dateCreated: FieldValue.serverTimestamp(),
    category,
    caption,
    likes: [],
    bookmarks: [],
    comments: [],
    published: true,
    likeCount: 0,
  });
}

export async function UnpublishDraft(docId) {
  return await firebase.firestore().collection("pieces").doc(docId).update({
    category: false,
    published: false,
  });
}

export async function getDraftList(userId) {
  if (!userId){
      return null
  }
  const result = await firebase
    .firestore()
    .collection("pieces")
    .where("userId", "==", userId)
    .where("published", "==", false)
    .orderBy("lastUpdated", "desc")
    .limit(50)
    .get();
  return result.docs.map((piece) => ({
    ...piece.data(),
    docId: piece.id,
  }));
}

export async function decimateDraft(docId){
    return await firebase.firestore().collection('pieces').doc(docId).delete()
}