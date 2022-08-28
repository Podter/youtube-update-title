import { google } from "googleapis";
const youtube = google.youtube("v3");
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms)); // default 2 secs

import clientSecret from "./client_secret.json";
import config from "./config.json";
import token from "./user_credential.json";

const oauth2Client = new google.auth.OAuth2(
  clientSecret.web.client_id,
  clientSecret.web.client_secret,
  clientSecret.web.redirect_uris[0]
);

oauth2Client.credentials = token;

let videoTitle: string;

async function update() {
  let categoryId: string | null | undefined;
  let newVideoTitle: string = "null";
  let oldVideoTitle: string = "";

  // get info
  await youtube.videos
    .list({
      auth: oauth2Client,
      id: [config.id],
      part: ["snippet", "statistics"],
    })
    .then((video) => {
      const videoJson = JSON.parse(JSON.stringify(video));
      categoryId = videoJson.data.items[0].snippet.categoryId;
      oldVideoTitle = videoJson.data.items[0].snippet.title;

      const views = parseInt(videoJson.data.items[0].statistics.viewCount);
      const likes = parseInt(videoJson.data.items[0].statistics.likeCount);
      const dislikes = parseInt(
        videoJson.data.items[0].statistics.dislikeCount
      );
      const comments = parseInt(
        videoJson.data.items[0].statistics.commentCount
      );

      newVideoTitle = `this video has ${views} views, ${likes} likes, ${dislikes} dislikes and ${comments} comments. 🤯`; // change video title here
    })
    .catch((err) => {
      console.log("Error");
      return console.log(err);
    });

  if (newVideoTitle !== oldVideoTitle) {
    // update
    await youtube.videos
      .update({
        auth: oauth2Client,
        part: ["snippet"],
        requestBody: {
          id: config.id,
          snippet: {
            title: newVideoTitle,
            categoryId: categoryId,
          },
        },
      })
      .then((message) => {
        console.log(`Success! Updated to "${newVideoTitle}"`);
        return console.log(message);
      })
      .catch((err) => {
        console.log("Error");
        return console.log(err);
      });
  } else {
    return console.log(
      `Didn't update because it's same title "${oldVideoTitle}"`
    );
  }
}

async function main() {
  while (true) {
    await update();
    await sleep(480000); // 8 mins
  }
}

main();
