console.log("begin");
document.getElementById("QA_form").addEventListener("submit", getValues);

function getValues() {
    var form = document.getElementById("QA_form");

    var question = form.elements[0];
    var answer = form.elements[1];
    alert(question.value);
    alert(answer.value);
}