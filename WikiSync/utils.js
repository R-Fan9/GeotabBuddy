exports.parseTextToJson = (text) => {
  const sections = text.split("\r\n");

  let result = []
  for (let i = 0; i < sections.length; i+=4) {
    result.push({
      question: sections[i], answer: sections[i+1]
    });
  }
  return result;
};

