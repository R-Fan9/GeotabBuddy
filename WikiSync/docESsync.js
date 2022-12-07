const { default: axios } = require("axios");
const { google } = require("googleapis");

const google_doc_api = "https://docs.googleapis.com/v1/documents/";
const scopes = ["https://www.googleapis.com/auth/drive.metadata.readonly"];

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: scopes,
});
const googleDrive = google.drive({ version: "v3", auth });

const docs = [
  "https://docs.google.com/document/d/1gdNchPnyyz6vSasbtHWjn_IWDTpKa1a0t-VOiJGeqFE/edit",
];

const getDocId = (docUrl) => {
  const result = docUrl.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);

  return result[1];
};

const getDocContent = async (docId) => {
  try {
    const res = await googleDrive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    });
    const files = res.data.files;
    if (files.length === 0) {
      console.log("No files found.");
      return;
    }

    console.log("Files:");
    files.map((file) => {
      console.log(`${file.name} (${file.id})`);
    });

    // googleDrive.
    // const response = await axios({
    //   method: "get",
    //   url: `${google_doc_api}${docId}`,
    // });

    // return response.data;
  } catch (error) {
    console.error(error);
  }
};

docs.forEach((doc) => {
  const docId = getDocId(doc);
  const docContent = getDocContent(docId);

  console.log(docContent);
});
