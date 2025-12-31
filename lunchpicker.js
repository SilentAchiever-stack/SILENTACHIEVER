let lunches = [];
function addLunchEnd(arr, lunchItem){
    arr.push(lunchItem);
    console.log(`${lunchItem} added to the end of the lunch list.`);
    return arr;
}
addLunchEnd(lunches,"yam");
console.log(lunches);

function addLunchStart(arr, lunchItem){
    arr.unshift(lunchItem);
    console.log(`${lunchItem} added to the start of the lunch list.`);
    return arr;
}
addLunchStart(lunches,"rice");
console.log(lunches);

function removeLastItem(arr, lunchItem){
     if(arr.length > 0){
        arr.pop();
        console.log(`${lunchItem} removed from the end of the lunch list.`);
         return arr;
    }
     else{ console.log('no lunches to remove');
    }
    return arr;
}
removeLastItem(lunches,"yam");
console.log(lunches);

function removeFirstItem(arr, lunchItem){
     if(arr.length > 0){
        arr.shift();
        console.log(`${lunchItem} removed from the start of the lunch list.`);
         return arr;
    }
     else{ console.log('no lunches to remove');
    }
    return arr;
}
removeFirstItem(lunches,"rice");
console.log(lunches);

function getRandomlunch(arr){
    if(arr.length > 0){
    let randomIndex = Math.floor(Math.random() * arr.length);
    let lunchItem = arr[randomIndex];
    console.log(`Randomly selected lunch: ${lunchItem}`);
    }
    else{
    console.log('No lunches available to select from.');
    }
}
 getRandomlunch(lunches);
 console.log(lunches);   

 function showLunchMenu(arr){
    if(arr.length > 0){
    console.log(`Menu items:arr.join(', ')`);
    }
    else{
    console.log('No lunches available in the menu.');
    }
    }
    showLunchMenu(lunches);