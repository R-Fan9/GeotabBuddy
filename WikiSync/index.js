const { google } = require("googleapis");
const { getAllDocIds, getDocText, syncDocToES } = require("./docESsync");
const { parseTextToJson } = require("./utils");

const scopes = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  scopes: scopes,
});

exports.docElasticSearchSync = async (req, res) => {
  try {
    const authClient = await auth.getClient();
    const googleDrive = google.drive({ version: "v3", auth: authClient });

    const docs = await getAllDocIds(googleDrive);

    for (var i = 0; i < docs.length; i++) {
      const docText = await getDocText(googleDrive, docs[i].id);
      const docJson = parseTextToJson(docText);
      await syncDocToES(docJson);
    }

    res.status(200).send("Job Completed Successfully");
  } catch (error) {
    console.error(error);
  }
};
