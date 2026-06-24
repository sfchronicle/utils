#!/usr/bin/env node

var { google } = require("googleapis");

var os = require("os");
var path = require("path");
var fs = require("fs");

// Prep the service account for drive
var serviceAccountCreds = path.join(
  os.homedir(),
  "service-account-google-creds.json"
);
var authRetryDelayMs = 10000;
var authRetryCount = 3;

var wait = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

var authorizeWithRetry = async function (jwtClient) {
  for (var attempt = 1; attempt <= authRetryCount + 1; attempt++) {
    try {
      return await jwtClient.authorize();
    } catch (err) {
      console.log(
        `GOOGLEAUTH: jwtClient.authorize() attempt ${attempt} failed:`,
        err.message || err
      );

      if (attempt > authRetryCount) {
        throw err;
      }

      console.log(
        `GOOGLEAUTH: Waiting ${authRetryDelayMs / 1000} seconds before retrying service account authentication...`
      );
      await wait(authRetryDelayMs);
    }
  }
};

var authenticate = function () {
  console.log("\n========== GOOGLEAUTH: authenticate() called ==========");

  return new Promise((resolve, reject) => {
    try {
      console.log("GOOGLEAUTH: Attempting service account authentication...");

      // If it's coming from EC2, pull from project
      if (process.env.GOOGLE_OAUTH_SYSTEM === "EC2") {
        serviceAccountCreds = "../service-account-google-creds.json";
      }

      console.log("GOOGLEAUTH: Loading credentials from:", serviceAccountCreds);

      var serviceAccountJSON = fs.readFileSync(serviceAccountCreds, "utf-8");
      serviceAccountJSON = JSON.parse(serviceAccountJSON);

      console.log(
        "GOOGLEAUTH: Service account email:",
        serviceAccountJSON.client_email
      );

      // configure a JWT auth client
      let jwtClient = new google.auth.JWT(
        serviceAccountJSON.client_email,
        null,
        serviceAccountJSON.private_key,
        [
          "https://www.googleapis.com/auth/spreadsheets",
          "https://www.googleapis.com/auth/drive",
        ]
      );

      console.log("GOOGLEAUTH: JWT client created, authorizing...");

      //authenticate request
      authorizeWithRetry(jwtClient)
        .then((tokens) => {
          console.log("Successfully connected to service account!");
          console.log(
            "GOOGLEAUTH: Token type:",
            tokens ? tokens.token_type : "unknown"
          );
          console.log(
            "GOOGLEAUTH: Token expires:",
            tokens ? tokens.expiry_date : "unknown"
          );
          // Return the jwtClient as auth
          resolve(jwtClient);
        })
        .catch((err) => {
          console.log("GOOGLEAUTH: Stage 1 error during jwtClient.authorize()");
          console.log("GOOGLEAUTH: Error details:", err.message || err);
          reject(err);
        });
    } catch (err) {
      console.log("GOOGLEAUTH: Stage 2 error (catch block)");
      console.log("GOOGLEAUTH: Error details:", err.message || err);
      reject(err);
    }
  });
};

let fullAuth = {
  authenticate: authenticate,
};
module.exports = fullAuth;
