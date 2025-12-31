let question;
question = 'What is JavaScript?';
let choices = ["programming language","snake","car","phone"];
let answer = "programming language";


const randomQuestion = getRandomQuestion(question);
const computerChoice = getRandomComputerChoice(/*randomQuestion.*/choices);

const Question = [/* category, question, choices, answer*/

{
       category : "programming",
        question : "what is javascript?",
        choices : ["programming language","snake","car","phone"],
        answer : "programming language"
    }
]
//let question;
//question = 'What is JavaScript?';


function getRandomQuestion(question){
    const randomIndex = Math.floor(Math.random() * question.length);
    return question[randomIndex];
}
function getRandomComputerChoice(/*randomQuestion.*/choices){
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}
function getResult(question, computerChoice){
    if(computerChoice === question.answer){
        return "the computer's choice is Correct!";
    }
    else{
        return `the computer's choice is Wrong!. the correct answer is: " + ${question.answer}`;
}
    
}
const result = getResult(question, computerChoice);
console.log("randomQuestion.question");
console.log("Computer's Choice: " + computerChoice);
console.log(result);