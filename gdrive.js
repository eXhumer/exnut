const fs = require("fs");
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
        fs.accessSync("conf/credentials.json", fs.constants.F_OK);
    } catch (error) {
        console.log(error);
        return false;
    }

    // load app creds
    const credentials = JSON.parse(fs.readFileSync("conf/credentials.json"));
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;

    // create oauth2 client
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    try {
        // try reading from existing token, if it exists
        const token = JSON.parse(fs.readFileSync("conf/gdrive.token"));
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
    fs.writeFileSync("conf/gdrive.token", JSON.stringify({
        access_token: oauth2Client.credentials.access_token,
        refresh_token: oauth2Client.credentials.refresh_token
    }));

    return google.drive({
        version: "v3",
        auth: oauth2Client
    });
};

module.exports = googleDriveService;