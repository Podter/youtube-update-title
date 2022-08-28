import { google } from "googleapis";
import express from "express";

import clientSecret from "./client_secret.json";
import config from "./config.json";

const app = express();

const youtube = google.youtube("v3");

let userCredential: any = null;

let views = 0;
let likes = 0;
let dislikes = 0;
let comments = 0;

const oauth2Client = new google.auth.OAuth2(
  clientSecret.web.client_id,
  clientSecret.web.client_secret,
  clientSecret.web.redirect_uris[0]
);

const scopes = ["https://www.googleapis.com/auth/youtube"];

app.get("/", (_req, res) => {
  res.json({ message: "youtube-update-title" });
});

// login
app.get("/login", (_req, res) => {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "online",
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
  });
  res.redirect(authorizationUrl);
});

// callback
app.get("/oauth2callback", async (req, res) => {
  // if no code query
  if (!req.query.code) return res.json({ message: "no code query provided" });

  let { tokens } = await oauth2Client.getToken(`${req.query.code}`);
  oauth2Client.setCredentials(tokens);

  userCredential = tokens;

  res.json({ message: "success" });
});

// logout
app.get("/logout", (_req, res) => {
  if (userCredential == null || !userCredential.access_token)
    return res.json({ message: "not logged in" });
  oauth2Client.revokeToken(userCredential.access_token);
  userCredential = null;
  res.json({ message: "success" });
});

// test1 get video info
app.get("/test1", async (_req, res) => {
  await youtube.videos
    .list({
      auth: oauth2Client,
      id: [config.id],
      part: ["statistics", "snippet"],
    })
    .then((video) => res.json({ message: video }))
    .catch((err) => res.json({ message: `${err}` }));
});

// test2 update video title to "hello world!"
app.get("/test2", async (_req, res) => {
  let categoryId;
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
    .catch((err) => res.json({ message: `${err}` }));

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
    .then((message) => res.json({ message: message }))
    .catch((err) => res.json({ message: `${err}` }));
});

// test3 update video title to "this video has X views."
app.get("/test3", async (_req, res) => {
  let categoryId;
  await youtube.videos
    .list({
      auth: oauth2Client,
      id: [config.id],
      part: ["snippet", "statistics"],
    })
    .then((video) => {
      const videoJson = JSON.parse(JSON.stringify(video));
      categoryId = videoJson.data.items[0].snippet.categoryId;

      const videoViews = parseInt(videoJson.data.items[0].statistics.viewCount);
      const videoLikes = parseInt(videoJson.data.items[0].statistics.likeCount);
      const videoDislikes = parseInt(
        videoJson.data.items[0].statistics.dislikeCount
      );
      const videoComments = parseInt(
        videoJson.data.items[0].statistics.commentCount
      );

      if (views !== videoViews) views = videoViews;
      if (likes !== videoLikes) likes = videoLikes;
      if (dislikes !== videoDislikes) dislikes = videoDislikes;
      if (comments !== videoComments) comments = videoComments;
    })
    .catch((err) => res.json({ message: `${err}` }));

  // change title here
  let videoTitle = `this video has ${views} views, ${likes} likes, ${dislikes} dislikes and ${comments} comments. 🤯`;

  await youtube.videos
    .update({
      auth: oauth2Client,
      part: ["snippet"],
      requestBody: {
        id: config.id,
        snippet: {
          title: videoTitle,
          categoryId: categoryId,
        },
      },
    })
    .then((message) => res.json({ message: message }))
    .catch((err) => res.json({ message: `${err}` }));
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`App listening on port ${process.env.PORT || 8080}`)
);
