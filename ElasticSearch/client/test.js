const { default: axios } = require("axios");

const BASE_URL = "http://localhost:8080";

var date = new Date();
const q1 = { anwser: "Bob" };

const createQuestion = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/question`,
      data: data,
    });
    const newQuestion = response.data;

    console.log("A new question is created!", newQuestion);
    return newQuestion;
  } catch (error) {
    console.error(error);
  }
};

const updateQuestion = async (data) => {
  try {
    const response = await axios({
      method: "patch",
      url: `${BASE_URL}/question?id=saYw6YQBia7B8KXVRl7B`,
      data: data,
    });
    const updatedQuestion = response.data;

    console.log(
      `Question(${data.question}) has been updated!`,
      updatedQuestion
    );
    return updateQuestion;
  } catch (error) {
    console.error(error);
  }
};

const getQuestions = async (text) => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/question?search=${text}`,
    });
    const questions = response.data;

    console.log("Here are a list a matching questions", questions);
    return questions;
  } catch (error) {
    console.error(error);
  }
};

getQuestions("bob");

// updateQuestion(q1);
// createQuestion(q1);
