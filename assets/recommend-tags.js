// get JSON from given json URL and remove characters for escaping
function getXHR () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
}

function load (location, callback) {
    var xhr = getXHR();
    xhr.open('GET', location, true);
    xhr.onreadystatechange = createStateChangeListener(xhr, callback);
    xhr.send();
}

function createStateChangeListener(xhr, callback) {
    return function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {const sanitizedResponse = xhr.responseText.match(/[a-zA-Z0-9\s\uAC00-\uD7A3{}[\]":,]/g).join('');
            callback(null, sanitizedResponse);
            } catch (err)
            {
            callback(err, null)
            }
        }
    };
}

// We'll use only the contents
function getContent (data) {
    jsonArray = data.map(d => d['content'])
    return jsonArray
}

var dictionary = []
const dicCSVURL = '/dic.csv';
load(dicCSVURL, function (err, text) {
    console.log('texttexttexttext', text[0])
    dictionary.push(text[0])
});
console.log(dictionary.length)

document.addEventListener("DOMContentLoaded", function() {
    const jsonURL = '/search.json';
    var rawText = []

    hmm = new Pos();
    const txt = '머리가 조금 아프네요'
    // res = hmm.tag(txt).filter(item => item[1] === 'NN').map(item => item[0]);
    // res = hmm.tag(txt)
    // console.log('resresres', res)

    load(jsonURL, function (err, text) {
        json = JSON.parse(text);
        jsonArray = getContent(json);
        rawText.push(jsonArray)
        });
    // console.log('rawText', rawText)
  })
