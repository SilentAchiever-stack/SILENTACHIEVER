function updateRecords(id, prop, value) {
    if (value === "") {
        delete collections[id][prop];
    } else if (prop === "artist" || prop === "album") {
        collections[id][prop] = value;
        
    }
    return collections;
}


let collections;
collections = {
    829: { artist: "Taylor Swift",  album: "slippery when wet", year: 2014 },
    731: { artist: "Adele", album: "you give love a bad name", year: 2015 },
    615: { artist: "Ed Sheeran", album: "Divide", year: 2017 },
};
updateRecords(829, "artist", "");
console.log(collections);
updateRecords(731, "album", "you give love a bad name");
console.log(collections);
updateRecords(615, "year",2017);
console.log(collections);