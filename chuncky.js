function chunkyArrayInGroups(arr, number){
    let result = [];
    for(let i = 0; i<=arr.length;i+=number){
        result.push(arr.slice(i, i+ number));
    }
    return result;
}
console.log(chunkyArrayInGroups(['a','b','c','d','e'],4));



/*let result = [], prepares a container for all the smaller arrays
for loops starts at 0 and jumps 'number' steps each iteration,so we move to the next chunck eAch time.
arr.slice  takes a paet of the array starting at i up to (but not including)i + number
example: its grabs first  2 or more ...... toys of your array 
*/