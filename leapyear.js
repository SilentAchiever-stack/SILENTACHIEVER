let year;
year=2000;

function isLeapYear(year){
    if(year%4===0&&year%100!==0||year%400===0){
        return year + " is a leap year.";
    }    else{
        return year + " is not a leap year.";
    }
}
let result=isLeapYear(year);
console.log(result);

