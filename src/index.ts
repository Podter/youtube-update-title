import { google } from "googleapis";
import express from "express";

import clientSecret from "./client_secret.json";

const app = express();

console.log(clientSecret.web.redirect_uris[1]);

const oauth2Client = new google.auth.OAuth2(
  clientSecret.web.client_id,
  clientSecret.web.client_secret,
  clientSecret.web.redirect_uris[1]
);

const scopes = ["https://www.googleapis.com/auth/youtube"];

app.get("/", (_req, res) => {
  res.json({ message: "youtube-update-title" });
});

// login
app.get("/login", (_req, res) => {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
  });
  res.redirect(`${authorizationUrl}${clientSecret.web.redirect_uris[1]}`);
});

// callback
app.get("/oauth2callback", async (req, res) => {
  // if no code query
  if (!req.query.code) return res.json({ message: "no code query provided" });

  res.json({ message: "success", code: req.query.code });
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`App listening on port ${process.env.PORT || 8080}`)
);
