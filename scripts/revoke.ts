// logout (revoke)

import { google } from "googleapis";

import clientSecret from "../client_secret.json";
import token from "../user_credential.json";

const oauth2Client = new google.auth.OAuth2(
  clientSecret.web.client_id,
  clientSecret.web.client_secret,
  clientSecret.web.redirect_uris[0]
);

async function main() {
  await oauth2Client.revokeToken(token.access_token);
  console.log("Done! Don't forget to delete user_credential.json");
}

main();
