/**
 * Author: Janvi Patel
 * Cloud function which will be triggered on click of Logout and it will update the status in firestore.
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
  res.set("Access-Control-Allow-Methods", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Request-Headers", "*");

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.status(204).send("");
    return;
  }
  if (req.method === "POST") {
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

        return query.docs[0].ref
          .update({
            active: false,
          })
          .then(() => res.status(200).send("SUCCESS"))
          .catch((err) =>
            res.status(500).send({
              error: err,
            })
          );
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
