// update video title to videoTitle

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

async function main() {
  let categoryId: string | null | undefined;
  let description: string | null | undefined;
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
      description = videoJson.data.items[0].snippet.description;

      const views = parseInt(videoJson.data.items[0].statistics.viewCount);
      const likes = parseInt(videoJson.data.items[0].statistics.likeCount);
      const dislikes = parseInt(
        videoJson.data.items[0].statistics.dislikeCount
      );
      const comments = parseInt(
        videoJson.data.items[0].statistics.commentCount
      );

      newVideoTitle = `i have ${views} views, ${likes} likes, ${dislikes} dislikes and ${comments} comments.`; // change video title here
    })
    .catch((err) => {
      console.log(err);
      return process.exit(1);
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
            description: description,
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
  } else {
    console.log("didnt update");
    return process.exit(0);
  }
}

main();
