//------------- Works only inside the plugin window ----------------//


document.addEventListener('DOMContentLoaded', function() {
    // Add word button event
    document.getElementById('addWord').addEventListener('click', addWord, false);
    //Remove word button event
    document.getElementById('removeWord').addEventListener('click', removeWord, false);

    displayWords()

    function displayWords() {
        let ul = document.createElement('ul');
        document.getElementById('wordListDiv').appendChild(ul);
        let existing = localStorage.getItem('wordsArray');
        // If no existing data, create an array
        // Otherwise, convert the localStorage string to an array
        existing = existing ? existing.split(',') : [];

        existing.forEach(function(item) {
            let li = document.createElement('li');
            ul.appendChild(li);
            li.innerHTML += item;
        });
    }

    function removeList() {
        let list = document.getElementById('wordListDiv');
        list.innerHTML = "";
    }

    chrome.tabs.query({ currentWindow: true, active: true },
        function(tabs) {
            let msg = {
                action: "launch",
                txt: localStorage.getItem("wordsArray")
            }
            chrome.tabs.sendMessage(tabs[0].id, msg)
        }
    )

    function checkIfArrayExists() {
        if (localStorage.hasOwnProperty("wordsArray")) {
            return true;
        } else {
            return false;
        }
    }

    function addWordToArray(word) {
        if (!checkIfArrayExists()) {
            localStorage.setItem("wordsArray", generateArray().toString())
            addWordToArray(word)
        } else {
            // Get the existing data
            let existing = localStorage.getItem('wordsArray');
            // If no existing data, create an array
            // Otherwise, convert the localStorage string to an array
            existing = existing ? existing.split(',') : [];
            // Add new data to localStorage Array
            existing.unshift(word);
            // Save back to localStorage
            localStorage.setItem('wordsArray', existing.toString());
        }
    }

    function removeWordFromArray(word) {
        if (!checkIfArrayExists()) {
            localStorage.setItem("wordsArray", generateArray().toString())
            removeWordFromArray(word)
        } else {
            // Get the existing data
            let existing = localStorage.getItem('wordsArray');
            // If no existing data, create an array
            // Otherwise, convert the localStorage string to an array
            existing = existing ? existing.split(',') : [];
            // Add new data to localStorage Array
            existing = existing.filter(function(e) { return e !== word })
                // Save back to localStorage
            localStorage.setItem('wordsArray', existing.toString());
        }
    }

    function removeWord() {
        removeWordFromArray(getWord())
        chrome.tabs.query({ currentWindow: true, active: true },
            function(tabs) {
                // Formulate a message, that will be sent over to the content script
                let msg = {
                    action: "remove",
                    txt: localStorage.getItem("wordsArray")
                }
                clearField()
                chrome.tabs.sendMessage(tabs[0].id, msg)
            }
        )
        removeList()
        displayWords()
    }

    function addWord() {
        addWordToArray(getWord());
        chrome.tabs.query({ currentWindow: true, active: true },
            function(tabs) {
                // Formulate a message, that will be sent over to the content script
                let msg = {
                    action: "add",
                    txt: localStorage.getItem("wordsArray")
                }
                clearField()
                chrome.tabs.sendMessage(tabs[0].id, msg)
            }
        )
        removeList()
        displayWords()
    }



}, false)

// Retrieves the word from the text field
function getWord() {
    return document.getElementById('inputField').value;
}

// Clears the text field
function clearField() {
    document.getElementById('inputField').value = null;
}

// Generates and returns an array
function generateArray() {
    let wordsArray = [];
    return wordsArray;
}

// Pass and save an array in Chrome storage
function saveAndLoadArray(array) {
    chrome.storage.sync.set({ 'words': array }, function() {
        //alert("Array Genenrated and Saved");
        chrome.storage.sync.get("words", function(data) {
            return data.words
        })
    });
}

// Returns true if object is empty
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// Returns the array from chrome storage
function loadArray() {
    chrome.storage.sync.get('words', function(data) {
        // If the retrieved object is either empty or null
        if (typeof data.words === 'undefined') {
            saveAndLoadArray(generateArray())
        } else {
            return (data.words)
        }
    });
}

function retrieveArray() {
    chrome.storage.sync.get("words", function(data) {
        //alert("Data loaded");
        // If the array does not exist we create and save it 
        if (typeof data.words === 'undefined') {
            chrome.storage.sync.set({ 'words': generateArray() }, function() {
                //alert("Array Genenrated and Saved");
                chrome.storage.sync.get("words", function(data) {
                    return data.words
                })
            });
        } else {
            return data.words
        }
    })
}