import app from "./app";
import * as functionsV2 from "firebase-functions/v2";

console.log("hello from index.ts");
exports.api = functionsV2.https.onRequest(
    {
      region: "us-central1",
      memory: "2GiB",
      // minInstances: 1,
      invoker: "public",
    } as functionsV2.https.HttpsOptions,
    app
);

exports.helloWorld = functionsV2.https.onRequest(
    {
      region: "us-central1",
      memory: "2GiB",
      // minInstances: 1,
      invoker: "public",
    } as functionsV2.https.HttpsOptions,
    (req, res) => {
      console.log("Hello from Firebase!");
      res.send("Hello from Firebase!");
    }
);
