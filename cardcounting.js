let count = 0;

function cardCounting(card) {
    if (card >= 2 && card <= 6) {
        count++;
    } else if (card === 10 || card === 'J' || card === 'Q' || card === 'K' || card === 'A') {
        count--;
    }
   
     return count < 0 ? `${count} bet` : `${count} hold`;
     
}

console.log(cardCounting(2));
console.log(cardCounting(3));
console.log(cardCounting(7));
console.log(cardCounting('K'));
console.log(cardCounting('A'));
console.log(cardCounting(4));