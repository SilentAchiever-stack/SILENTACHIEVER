const min = 100;
const max = 999;
const securityCode = Math.floor(Math.random()*max-min) + min;
console.log("shh! the secret code is: " + securityCode);
let userID = prompt("Enter your 4-digit ID:");
userID = Number(userID);
let validationNumber = userID % 100;

if(userID)

