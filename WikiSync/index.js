const { google } = require("googleapis");
const { PubSub } = require("@google-cloud/pubsub");
const { getAllDocIds, getDocText, syncDocToES } = require("./docESsync");
const { parseTextToJson } = require("./utils");

const scopes = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/documents"];

const auth = new google.auth.GoogleAuth({
  scopes: scopes,
});

const topicName =
  "projects/haozheng-fan/topics/geotab-buddy-sync-doc-to-elastic-search";

const pubSubClient = new PubSub();
const topicPublisher = pubSubClient.topic(topicName)

const publishMsg = async (data) => {
  const dataBuffer = Buffer.from(data);

  try {
    const msgId = await topicPublisher.publishMessage({ data: dataBuffer });
    console.log(`message ${msgId} published`);
  } catch (err) {
    console.error(err);
  }
};

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

    await publishMsg(JSON.stringify({ status: "completed" }));

    res.status(200).send("Job Completed Successfully");
  } catch (error) {
    console.error(error);
  }
};

