//---------------- Works with the page contents only ----------------//

// Filter out requests by name

let words;

function loopThroughWords(returnedWords) {
    let wordArr = returnedWords.split(',');
    for (var i = 0; i < wordArr.length; i++) {
        //console.log(wordArr[i]);
        highlightMatch(wordArr[i]);
    }
}

setInterval(function() {
    loopThroughWords(words);
}, 4321);

if (typeof words == 'undefined') {
    words = "dfaerbuhqwerbuhwerbuhbuhwerbujhhbherbh"
} else if (words == "") {
    words = "dfaerbuhqwerbuhwerbuhbuhwerbujhhbherbh"
}

chrome.runtime.onMessage.addListener(function(request) {
    switch (request.action) {
        case "add":
            //Add word to array function
            console.log("Add Word")
            if (checkIfNull(request.txt)) {
                console.log('Field is empty')
            } else {
                words = request.txt
                console.log(words)
            }
            break;
        case "remove":
            //Remove word from array function
            console.log("Remove Word")
            if (checkIfNull(request.txt)) {
                console.log('Field is empty')
            } else {
                words = request.txt
                console.log(words)
            }
            break;
        case "launch":
            words = request.txt
                //console.log(words)
            break;
        default:
            console.log('No request recieved!')
            break;
    }
})

// Checks if the string passed is empty
function checkIfNull(text) {
    if (text === "") {
        return true
    } else {
        return false
    }
}

// Creates an array
function createArray() {
    let wordsArray = ['word1', 'word2'];
    return wordsArray;
}

// Adds words to the list from array
function arrayToList(wordsArray) {
    let list = document.getElementById("wordList");
    wordsArray.array.forEach(element => {
        let listItem = document.createElement('li');
        list.appendChild(listItem);
        listItem.innerHTML += element;
    });
    return null;
}

// Removes posts based on a passed word 
function highlightMatch(word) {
    // Get all posts
    let posts = getAllLoadedFullPosts();
    // Loop through each post
    for (let i = 0, l = posts.length; i < l; i++) {
        // Regex the word 
        let patt = new RegExp(word);
        // Get inner text of post
        let innerText = posts[i].innerText;
        // Check if posts contains sed word
        let res = patt.test(innerText);
        // If word is present remove post
        if (res) {
            posts[i].style.display = 'none';
        } else {

        }
    }
}

// Returns all posts 
function getAllLoadedFullPosts() {
    // Finds entire Facebook post
    let feedUnit = "[data-pagelet^='FeedUnit_']";
    // Retrieve all pagelets
    let fullPosts = document.querySelectorAll(feedUnit);
    // Return all loaded posts
    return fullPosts
}

// Removes every single post from facebook when button is pressed 
function removeAllPosts() {
    let post = getAllLoadedFullPosts();
    // Set every post to display none
    for (var i = 0, l = post.length; i < l; i++) {
        post[i].style.display = 'none';
    }
}