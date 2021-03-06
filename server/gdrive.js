const fs = require("fs/promises");
const {constants} = require("fs");
const {stdin, stdout} = process;
const {google} = require("googleapis");

const promptAnswer = (question) => {
    return new Promise((resolve, reject) => {
        stdin.resume();
        stdout.write(question);
        stdin.on("data", data => resolve(data.toString().trim()));
        stdin.on("error", err => reject(err));
    });
};

const googleDriveService = async () => {
    // return false if app credentials doesn't exist
    try {
        await fs.access("conf/credentials.json", constants.R_OK);
    } catch (error) {
        console.log(error);
        return false;
    }

    // load app creds
    const credentialsStr = await fs.readFile("conf/credentials.json");
    const credentials = JSON.parse(credentialsStr);
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;

    // create oauth2 client
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    try {
        // try reading from existing token, if it exists
        const tokenStr = await fs.readFile("conf/gdrive.token");
        const token = JSON.parse(tokenStr);
        oauth2Client.setCredentials(token);
    } catch(err) {
        // new token if error occurs while reading token from file
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/drive"]
        });
        console.log("Authorize this application by visiting this URL:", authUrl);
        const authCode = await promptAnswer("Enter the authorization code received: ");
        const {tokens} = await oauth2Client.getToken(authCode);
        oauth2Client.setCredentials(tokens);
    }

    // save access_token/refresh_token to file (caching for later quicker use)
    await fs.writeFile("conf/gdrive.token", JSON.stringify({
        access_token: oauth2Client.credentials.access_token,
        refresh_token: oauth2Client.credentials.refresh_token
    }));

    return google.drive({
        version: "v3",
        auth: oauth2Client
    });
};

module.exports = googleDriveService;