let books;
books = [{title : 'to kill a monkey', authorName : 'olatunji sarah',
    releaseYear : 2025},
{title : 'Sarah\'s silence', authorName : 'keji', releaseYear :2019},
 {title : 'Sarah\'s pain', authorName : 'morenikeji', releaseYear :2012}
 ];

 function  sortByYear(book1,book2){
   
    if(book1.releaseYear < book2.releaseYear){
      
        return -1;
    }else if(book2.releaseYear > book1.releaseYear){
        return 1;
    }else{
        return 0;
    }
 }
let Books = books.filter(book => book.releaseYear > 2025);
Books.sort(sortByYear);
 console.log(sortByYear(books));
 //console.log(releaseYear);
    


