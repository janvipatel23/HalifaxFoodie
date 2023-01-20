/**
 * Author: Janvi Patel
 * Subcriber for complain topic.
 * It creates chatroom in firestore and push notification to Customer and Restaurant.
 * It uses Firebase Cloud Messaging service to push notification. 
 */

const { Firestore } = require("@google-cloud/firestore");
const admin = require("firebase-admin");
// const FCM = require("fcm-node");
// const { initializeApp } = require("firebase-admin");
// const = require("firebase-admin/")
const app = admin.initializeApp();

// Use your project ID here
const PROJECTID = "csci5410serverlessproject";
const COLLECTION_NAME = "chatrooms";

// var fcm = new FCM("AIzaSyBEpvHgp-mv-DG8yM76w8RqwVD__pKMCuQ");

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
  const message = Buffer.from(event.data, "base64").toString();
  const jsonData = JSON.parse(message);
  console.log("Strigify before firestore: ", JSON.stringify(jsonData));
  firestore
    .collection(COLLECTION_NAME)
    .add(jsonData)
    .then((doc) => {
      firestore
        .collection("registration_details")
        .where("emailId", "in", [jsonData.userId, jsonData.restId])
        .get()
        .then((docsSnap) => {
          let fcmTokens = docsSnap.docs
            .map((doc) => doc.data().token)
            .filter((token) => token != undefined || token != null);

          console.log("Tokens : ", fcmTokens);
          admin.messaging(app)
            .sendMulticast({
              //this may vary according to the message type (single recipient, multicast, topic, et cetera)
              tokens: fcmTokens,
              notification: {
                title: "Chatroom initiated.",
                body: jsonData.chatRoomId,
              },
            })
            .then((res) => console.log("Notification sent : ", res))
            .catch((err) => console.log("Error :", err));
        })
        .catch((err) => console.log("Error : ", err));
      console.info("stored new doc id#", doc.id);
    })
    .catch((err) => {
      console.log("Error", err);
    });
};
