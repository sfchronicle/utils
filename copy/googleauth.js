#!/usr/bin/env node

var { google } = require("googleapis");
var opn = require("opn");

var http = require("http");
var os = require("os");
var path = require("path");
var url = require("url");
var fs = require("fs");
var writeFile = require("write");

// Prep the service account for drive
var serviceAccountCreds = path.join(
  os.homedir(),
  "service-account-google-creds.json"
);
var tokenLocation = path.join(os.homedir(), ".google_oauth_token");

var fallbackAuth = function () {
  // If it's coming from EC2, pull from project
  if (process.env.GOOGLE_OAUTH_SYSTEM === "EC2") {
    tokenLocation = "../.google_oauth_token";
  }

  try {
    var tokens = fs.readFileSync(tokenLocation, "utf-8");
    tokens = JSON.parse(tokens);
    auth = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CONSUMER_SECRET
    );
    auth.setCredentials(tokens);

    auth.on("tokens", function (update) {
      Object.assign(tokens, update);
      fs.writeFileSync(tokenLocation, JSON.stringify(tokens, null, 2));
    });
  } catch (err) {
    // If we error here, fire up local (as long as we're on on EC2)
    if (process.env.GOOGLE_OAUTH_SYSTEM !== "EC2") {
      task();
    }
  }
  return auth;
};

var authenticate = function ({ fallback }) {
  if (fallback) {
    return new Promise((resolve, reject) => {
      console.log(
        "Service account failed, falling back to regular token (to use the service account, share this sheet or doc with sfchronicle-gatsby@zinc-proton-250521.iam.gserviceaccount.com)"
      );
      resolve(fallbackAuth());
    });
  }
  // Try to use the service account first
  return new Promise((resolve, reject) => {
    try {
      // If it's coming from EC2, pull from project
      if (process.env.GOOGLE_OAUTH_SYSTEM === "EC2") {
        serviceAccountCreds = "../service-account-google-creds.json";
      }

      var serviceAccountJSON = fs.readFileSync(serviceAccountCreds, "utf-8");
      serviceAccountJSON = JSON.parse(serviceAccountJSON);

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
      //authenticate request
      jwtClient.authorize(function (err, tokens) {
        if (err) {
          console.log("Stage 1 error, fallback auth");
          resolve(fallbackAuth());
        } else {
          console.log("Successfully connected to service account!");
          // Return the jwtClient as auth
          resolve(jwtClient);
        }
      });
    } catch (err) {
      // It's ok if it errors, we have the fallback
      console.log("Stage 2 error, fallback auth");
      resolve(fallbackAuth());
    }
  });
};

var task = function () {
  // var done = this.async();

  var clientID = process.env.GOOGLE_OAUTH_CLIENT_ID;
  var secret = process.env.GOOGLE_OAUTH_CONSUMER_SECRET;

  var client = new google.auth.OAuth2(
    clientID,
    secret,
    "http://localhost:8000/authenticate/"
  );
  google.options({
    auth: client,
  });

  var scopes = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
  ];

  var authURL = client.generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "),
    prompt: "consent",
  });

  var onRequest = function (request, response) {
    response.setHeader("Connection", "close");
    if (request.url.indexOf("authenticate") > -1) {
      return onAuthenticated(request, response);
    } else if (request.url.indexOf("authorize") > -1) {
      response.setHeader("Location", authURL);
      response.writeHead(302);
    } else {
      response.writeHead(404);
    }
    response.end();
  };

  var onAuthenticated = async function (request, response) {
    var requestURL =
      request.url[0] == "/" ? "localhost:8000" + request.url : request.url;
    var query = new url.URL(requestURL).searchParams;
    var code = query.get("code");
    if (!code) return;
    try {
      var token = await client.getToken(code);
      var tokens = token.tokens;
      writeFile(tokenLocation, JSON.stringify(tokens, null, 2), function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Authenticated");
        }
      });
      response.end("Done! Now run your command again.");
    } catch (err) {
      response.end(err);
    }
  };

  var server = http.createServer(onRequest);
  server.listen(8000, () => opn("http://localhost:8000/authorize"));
};

let fullAuth = {
  task: task,
  authenticate: authenticate,
};
module.exports = fullAuth;
