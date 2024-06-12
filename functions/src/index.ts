import app from "./app";
import * as functionsV2 from "firebase-functions/v2";

exports.api = functionsV2.https.onRequest(
  {
    region: "us-central1",
    memory: "2GiB",
    // minInstances: 1,
    invoker: "public",
  } as functionsV2.https.HttpsOptions,
  app
);
