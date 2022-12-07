const { google } = require("googleapis");

const elasticClient = require("./elastic-client");

const scopes = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/documents"];

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: scopes,
});
const googleDrive = google.drive({ version: "v3", auth });

exports.getAllDocIds = async (drive) => {
  const res = await drive.files.list({
    fields: "nextPageToken, files(id)",
  });
  const fileIds = res.data.files;
  if (fileIds.length === 0) {
    console.log("No files found.");
    return;
  }

  return fileIds;
};

exports.getDocText = async (drive, docId) => {
  try {
    const doc = await drive.files.export({
      fileId: docId,
      mimeType: "text/plain",
    });
    const docText = doc.data;

    return docText;
  } catch (error) {
    console.error(error);
  }
};



const getQuestionId = async (question) => {
  const res = await elasticClient.search({
    index: "questions",
    query: {
      match: {
        question: {
          query: question,
        },
      },
    },
  });

  const questions = res.hits.hits;

  if (questions.length == 0) {
    console.log("no questions match")
    return null;
  }

  return questions[0]._id;
};

const updateAnswer = async (questionId, answer) => {
  const res = await elasticClient.update({
    index: "questions",
    id: questionId,
    doc: { answer },
  });

  console.log(`updated question ${questionId}`, res);
};

const insertQA = async (doc) => {
  const res = await elasticClient.index({
    index: "questions",
    document: doc,
  });

  console.log(`inserted question and answer ${res._id}`, res);
};

exports.syncDocToES = async (docJson) => {
  for (var i = 0; i < docJson.length; i++) {
    const docQA = docJson[i];
    const questionId = await getQuestionId(docQA.question);

    if (questionId != null) {
      updateAnswer(questionId, docQA.answer);
    } else {
      insertQA(docQA);
    }
  }
};