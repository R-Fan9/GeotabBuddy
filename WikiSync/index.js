const { google } = require("googleapis");

const scopes = ["https://www.googleapis.com/auth/drive.metadata.readonly"];

const auth = new google.auth.GoogleAuth({
  scopes: scopes,
});

exports.docElasticSearchSync = async (req, res) => {
  try {
    const authClient = await auth.getClient();
    const googleDrive = google.drive({ version: "v3", auth:authClient });

    const response = await googleDrive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    });
    const files = response.data.files;
    if (files.length === 0) {
      console.log("No files found.");
      return;
    }

    console.log("Files:");
    files.map((file) => {
      console.log(`${file.name} (${file.id})`);
    });

    res.status(200).send("Job Completed Successfully");
  } catch (error) {
    console.error(error);
  }
};
