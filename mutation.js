function mutation(arr){
    let arr1 = ['alien','lien'];
    if(arr1[1].toLowerCase().split('').every(letter => arr1[0].toLowerCase().includes(letter))){
        return true;
    }
    else{
        return false;
    }
}

console.log(mutation(['alien', 'lien']));

/* all letters of the second string should be present in the first string.
.toLowerCase() is use to ignore letter case when comparing the strings
e.g 'A' is considered equal to 'a'.
Alien is diff from lien cus of the A in capital letter so it has to be converted to lowercase case before comparison.
split('') is used to convert the second string into an array of individual letters. every() method is used to check if all letters in the second string are present in the first string.
includes() method is used to check if a letter from the second string is present in the first string.
*/