/**
 * Author: Janvi Patel
 * Subscriber for communication_history topic.
 * It will move entire meesaging conversation from messages to chatroom collection to manage the history.
 */
const { Firestore } = require("@google-cloud/firestore");

// Use your project ID here
const PROJECTID = "csci5410serverlessproject";
const COLLECTION_NAME = "chatrooms";
const MESSAGE_COLLECTION_NAME = "messages";
const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
  // NOTE: Don't hardcode your project credentials here.
  // If you have to, export the following to your shell:
  //   GOOGLE_APPLICATION_CREDENTIALS=<path>
  // keyFilename: '/csci5410serverlessproject-df578cf01eb5.json',
});

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = (event, context) => {
  console.log("Inside subscriber", JSON.stringify(event));
  const chatRoomId = Buffer.from(event.data, "base64").toString();
  console.log("Strigify before firestore: ", chatRoomId);
  firestore
    .collection(MESSAGE_COLLECTION_NAME)
    .where("chatRoomId", "==", chatRoomId)
    .get()
    .then((docSnap) => {
      let conversation = docSnap.docs.map((doc) => doc.data());
      console.log("Converstation :", JSON.stringify(conversation));

      firestore
        .collection(COLLECTION_NAME)
        .where("chatRoomId", "==", chatRoomId)
        .get()
        .then((docsSnap) => {
          let docRef = docsSnap.docs[0];
          let data = docRef.data();
          data.messages = conversation;
          firestore.collection(COLLECTION_NAME).doc(docRef.id).update({
            messages: conversation,
          });
        })
        .catch((err) => console.log("Error : ", err));
    })
    .catch((err) => console.log("Error while fetching messages : ", err));
};
