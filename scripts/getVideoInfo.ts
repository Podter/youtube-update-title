// get video info

import { google } from "googleapis";
const youtube = google.youtube("v3");

import clientSecret from "../client_secret.json";
import config from "../config.json";
import token from "../user_credential.json";

const oauth2Client = new google.auth.OAuth2(
  clientSecret.web.client_id,
  clientSecret.web.client_secret,
  clientSecret.web.redirect_uris[0]
);

oauth2Client.credentials = token;

youtube.videos
  .list({
    auth: oauth2Client,
    id: [config.id],
    part: ["statistics", "snippet", "id"],
  })
  .then((video) => {
    console.log(video);
    return process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    return process.exit(1);
  });
