/**
 * Author: Janvi Patel
 * Cloud function to add and verify user's 3rd Factor Authentication.
 */
const { Firestore } = require("@google-cloud/firestore");

// Use your project ID here
const PROJECTID = "csci5410serverlessproject";
const COLLECTION_NAME = "registration_details";
var chars = "abcdefghijklmnopqrstuvwxyz";
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
  res.set("Access-Control-Allow-Methods", "GET", "POST");
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

    firestore
      .collection(COLLECTION_NAME)
      .where("emailId", "==", data.emailId)
      .get()
      .then((query) => {
        let doc = query.docs[0];

        // TODO: Add encryption
        console.log("Encryption started");
        const encryptedText = Encrypt(
          normalize(data.secretText),
          normalize(data.securityKey),
          normalize("")
        );
        console.log("Encrypted Text : ", encryptedText);
        firestore
          .collection(COLLECTION_NAME)
          .doc(doc.id)
          .update({
            secretText: data.secretText,
            securityKey: data.securityKey,
          })
          .then((docRes) => {
            console.info("stored new doc id#", doc.id);
            return res.status(200).send({ encryptedText });
          })
          .catch((err) => {
            console.error(err);
            return res.status(404).send({
              error: "unable to store",
              err,
            });
          });
      })
      .catch((err) => console.log(err));
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

        console.log("Starting Decrypt");
        // TODO : Add decryption
        const decryptedText = Decrypt(
          normalize(data.secretText),
          normalize(userData.securityKey)
        );
        console.log("Decrypted Text : ", decryptedText);
        if (decryptedText.includes(normalize(userData.secretText))) {
          return query.docs[0].ref
            .update({
              active: true,
              token : data.token
            })
            .then(() => res.status(200).send("SUCCESS"))
            .catch((err) =>
              res.status(500).send({
                error: err,
              })
            );
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

function Encrypt(plaintext, key, pc) {
  var klen = key.length;
  if (pc == "") pc = "x";
  while (plaintext.length % klen != 0) {
    plaintext += pc.charAt(0);
  }
  var colLength = plaintext.length / klen;
  var ciphertext = "";
  k = 0;
  for (i = 0; i < klen; i++) {
    while (k < 26) {
      t = key.indexOf(chars.charAt(k));
      arrkw = key.split("");
      arrkw[t] = "_";
      key = arrkw.join("");
      if (t >= 0) break;
      else k++;
    }
    for (j = 0; j < colLength; j++) {
      ciphertext += plaintext.charAt(j * klen + t);
    }
  }
  return ciphertext;
}

function Decrypt(ciphertext, keyword) {
  var klen = keyword.length;

  // first we put the text into columns based on keyword length
  var cols = new Array(klen);
  var colLength = ciphertext.length / klen;
  for (i = 0; i < klen; i++)
    cols[i] = ciphertext.substr(i * colLength, colLength);
  // now we rearrange the columns so that they are in their unscrambled state
  var newcols = new Array(klen);
  j = 0;
  i = 0;
  while (j < klen) {
    t = keyword.indexOf(chars.charAt(i));
    if (t >= 0) {
      newcols[t] = cols[j++];
      arrkw = keyword.split("");
      arrkw[t] = "_";
      keyword = arrkw.join("");
    } else i++;
  }
  // now read off the columns row-wise
  var plaintext = "";
  for (i = 0; i < colLength; i++) {
    for (j = 0; j < klen; j++) {
      plaintext += newcols[j].charAt(i);
    }
  }
  return plaintext;
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}
