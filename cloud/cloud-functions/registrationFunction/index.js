/**
 * Author: Janvi Patel
 * Cloud function to add and verify user's 2nd Factor Authentication.
 */
const { Firestore } = require("@google-cloud/firestore");

// Use your project ID here
const PROJECTID = "csci5410serverlessproject";
const COLLECTION_NAME = "registration_details";

const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
  // NOTE: Don't hardcode your project credentials here.
  // If you have to, export the following to your shell:
  //   GOOGLE_APPLICATION_CREDENTIALS=<path>
  // keyFilename: '/csci5410serverlessproject-df578cf01eb5.json',
});

/**
 * Retrieve or store a method in Firestore
 *
 * Responds to any HTTP request.
 *
 * GET = retrieve
 * POST = store (no update)
 *
 * success: returns the document content in JSON format & status=200
 *    else: returns an error:<string> & status=404
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.main = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Request-Headers", "*");

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.status(204).send("");
    return;
  }

  if (req.method === "POST" && req.body.requestType === "user-registration") {
    // store/insert a new document
    const data = req.body || {};
    const userDocument = {
      emailId: data.emailId,
      answers: data.answers,
      active: false,
      userType: data.userType,
    };

    firestore
      .collection(COLLECTION_NAME)
      .add(userDocument)
      .then((doc) => {
        console.info("stored new doc id#", doc.id);
        return res.status(200).send(doc);
      })
      .catch((err) => {
        console.error(err);
        return res.status(404).send({
          error: "unable to store",
          err,
        });
      });
  } else if (
    req.method === "POST" &&
    req.body.requestType === "user-verification"
  ) {
    const data = req.body || {};

    firestore
      .collection(COLLECTION_NAME)
      .where("emailId", "==", data.emailId)
      .get()
      .then((query) => {
        console.log("Step 1 completed");
        if (query.empty) {
          return res.status(404).send({
            error: "User not found",
          });
        }

        let userData = query.docs[0].data();
        console.log(userData);
        let success = false;
        if (userData.answers) {
          console.log("data : ", JSON.stringify(data));
          for (const qa of userData.answers) {
            if (qa.question == data.question && qa.answer === data.answer) {
              {
                success = true;
                break;
              }
            }
          }
        }

        if (success) {
          return res.status(200).send("SUCCESS");
        } else {
          return res.status(404).send({
            error: "Details are incorrect!",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(404).send({
          error: "Error while searching user.",
          err,
        });
      });
  }
};
