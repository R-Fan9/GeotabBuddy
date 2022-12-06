const express = require("express");
const bodyParser = require("body-parser");
const elasticClient = require("./elastic-client");
require("express-async-errors");

const app = express();

app.use(bodyParser.json());

app.post("/question", async (req, res) => {
  const result = await elasticClient.index({
    index: "questions",
    document: req.body,
  });

  res.send(result);
});

app.patch("/question", async (req, res) => {
  const result = await elasticClient.update({
    index: "questions",
    id: req.query.id,
    doc: req.body,
  });

  res.send(result);
});

app.get("/question", async (req, res) => {
  const regexStr = `*${req.query.search}*`;

  const result = await elasticClient.search({
    index: "questions",
    query: {
      query_string: {
        query: regexStr,
        fields: ["question", "anwser"],
      },
    },
  });

  res.json(result.hits.hits);
});

app.listen(8080);
