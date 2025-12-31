let answer = Math.floor(Math.random()*6)+1;
let guess = Number(prompt("guess a number between 1 and 6"));
let number = answer;
function()
if(guess===number){
   alert(`you got it right!,the answer is ${answer}.`);
}
else if(guess>answer){
    alert("Too high, guess again!");
}
else{
   alert("too low!, guess again");
}

