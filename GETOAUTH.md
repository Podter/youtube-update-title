# Getting OAuth Client ID from Google

## Create a project

Go to https://console.cloud.google.com/ and create a project

![1](assets/getOAuth/1.png)
![2](assets/getOAuth/2.png)

And then select the project
![3](assets/getOAuth/3.png)

## Enable Youtube data API

Open menu and then go to "APIs and services" > "Enabled APIs & services"
![4](assets/getOAuth/4.png)

Click on "Enable APIs & services"
![5](assets/getOAuth/5.png)

Search for Youtube and click on "Youtube Data API v3"
![6](assets/getOAuth/6.png)

Enable it!
![7](assets/getOAuth/7.png)

## Create OAuth consent screen

Click on "OAuth consent screen" (left menu)
![8](assets/getOAuth/8.png)

Choose "External" and create
![9](assets/getOAuth/9.png)

Enter your app name, user support email and developer contact infomation and then click on "Save and continue"
![10](assets/getOAuth/10.png)
![11](assets/getOAuth/11.png)

> NOTE 1: Needed to fill in

> NOTE 2: You can use your own email

And then click on "Add or remove scopes"
![12](assets/getOAuth/12.png)

Search for youtube and select "Youtube Data API v3" with ".../auth/youtube" scope, click "Update" and then "Save and continue"
![13](assets/getOAuth/13.png)
![14](assets/getOAuth/14.png)
![15](assets/getOAuth/15.png)

Add test user (your youtube/google account email), click "Update" and then "Save and continue"
![16](assets/getOAuth/16.png)
![17](assets/getOAuth/17.png)
![18](assets/getOAuth/18.png)

Done! Click on "Back to dashboard" to go back
![19](assets/getOAuth/19.png)

## Generate OAuth client ID and client secret

Click on "Credentials" (left menu)
![20](assets/getOAuth/20.png)

Click on "Create credentials" (top menu) and then click on OAuth client ID
![21](assets/getOAuth/21.png)

Select "Web application", name it, click on "Add URI" and enter this URI `http://localhost/oauth2callback` and then create
![22](assets/getOAuth/22.png)

Done! Download the JSON file
![23](assets/getOAuth/23.png)

Rename it to `client_secret.json` and put it to your project folder
![24](assets/getOAuth/24.png)
