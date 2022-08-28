// login and generate user_credential.json (authorize)

import { google } from "googleapis";
import express from "express";
import fs from "fs";
import path from "path";
import { Credentials } from "google-auth-library";

import clientSecret from "../client_secret.json";

const app = express();

const oauth2Client = new google.auth.OAuth2(
  clientSecret.web.client_id,
  clientSecret.web.client_secret,
  clientSecret.web.redirect_uris[0]
);

const scopes = ["https://www.googleapis.com/auth/youtube"];

// store token to json
async function storeToken(token: Credentials) {
  const jsonPath = path.join(__dirname, "..", "user_credential.json");
  fs.writeFile(jsonPath, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + jsonPath);
    process.exit(0);
  });
}

// callback
app.get("/oauth2callback", async (req, res) => {
  // if no code query
  if (!req.query.code) {
    res.json({ message: "no code query provided" });
    return console.log("no code query provided");
  }

  await oauth2Client.getToken(`${req.query.code}`, (err: any, token: any) => {
    if (err) {
      res.json({
        message: `error while trying to retrieve access token`,
        error: `${err}`,
      });
      return console.log("error while trying to retrieve access token", err);
    }
    storeToken(token);
    res.json({ message: "success" });
  });
});

// listen
app.listen(process.env.PORT || 80, () => {
  console.log(`App listening on port ${process.env.PORT || 80}`);
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
  });
  console.log("Enter this url to login");
  console.log(authorizationUrl);
});
