// update video title to "hello world!"

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

let categoryId: string | null | undefined;

async function main() {
  await youtube.videos
    .list({
      auth: oauth2Client,
      id: [config.id],
      part: ["snippet"],
    })
    .then((video) => {
      const videoJson = JSON.parse(JSON.stringify(video));
      categoryId = videoJson.data.items[0].snippet.categoryId;
    })
    .catch((err) => {
      console.log(err);
      return process.exit(1);
    });

  await youtube.videos
    .update({
      auth: oauth2Client,
      part: ["snippet"],
      requestBody: {
        id: config.id,
        snippet: {
          title: "hello world!",
          categoryId: categoryId,
        },
      },
    })
    .then((message) => {
      console.log(message);
      return process.exit(0);
    })
    .catch((err) => {
      console.log(err);
      return process.exit(1);
    });
}

main();
