# youtube-update-title

update youtube title to match with views

## Usage

Make sure you have Node.js installed (LTS is recommended)

Clone or download this repository and install dependencies

```bash
git clone https://github.com/Podter/youtube-update-title.git
cd youtube-update-title
npm install
```

Download and rename the OAuth Client ID JSON file to `client_secret.json` and put in the folder

Rename `config_example.json` to `config.json` and put your video id there

```json
{
  "id": "dQw4w9WgXcQ"
}
```

Now let's login and generate access token `user_credential.json`

```bash
npm run login
```

Open in browser and select your account

And it's time to do some testing (optional)

```bash
npm run getvideo # Get video info
npm run update1 # Update title to "hello world!"
npm run update2 # Update title to "i have ... views"
```

Time to modify some codes (optional)

```typescript
// index.ts at line 45
newVideoTitle = `i have ${views} views, ${likes} likes, ${dislikes} dislikes and ${comments} comments.`; // change video title here
```

Finally, build and run the code

```bash
npm run build
npm start
```
