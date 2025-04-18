const express = require('express');
const app = express();
const port = 3000 ;

//function : findSummation
//Parameter: A positice number
//Returns: the summation from 1 to N,or flase if the input is invalid
function findSummation(n = 1) {
    // Only accept positive integers
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 1) {
        return false;
    }

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

function uppercaseFirstandLast(str){
    if (typeof str !== 'string') {
        return false;
    }

    const words = str.split(" ") ;
    const modifiedWords = words.map(word =>{
        if (word.length === 0 ){
            return word;
        }
        if (word.length === 1 ){
            return word.toUpperCase();
        }

        const firstChar = word.charAt(0).toUpperCase();
        const middle = word.slice(1,word.length - 1 );
        const lastChar = word.charAt(word.length -1).toUpperCase();
        return firstChar + middle + lastChar ;

    });
    return modifiedWords.join(" ");
}



function findAverageAndMedian(arr) {
    
    if (!Array.isArray(arr) || arr.length === 0) {
        return false;
    }

    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'number' || isNaN(arr[i])) {
            return false;
        }
    }

    // Calculate average
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const average = sum / arr.length;

    // Calculate median
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    let median;
    if (sorted.length % 2 === 0) {
        median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        median = sorted[mid];
    }

    return { average, median };
}




function find4Digits(str) {
    if (typeof str !== 'string') {
        return false;
    }
    const tokens = str.trim().split(/\s+/);
    for (let token of tokens) {
        if (/^\d{4}$/.test(token)) {
            return token;
        }
    }
    return false;
}



app.get('/',(req,res) =>{
    res.send(
        '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <title>Test Node.js Functions</title>\n' +
        '</head>\n' +
        '<body>\n' +
        '\n' +
        '<h1>Test Node.js Functions</h1>\n' +
        '\n' +
        '<h2>findSummation</h2>\n' +
        '<form action ="/findSummation" method="get">\n' +
        '    <label for="n">Enter a positive interger(default is 1 ):</label>\n' +
        '    <input type ="number" name = "n" id="n" min="1">\n' +
        '    <button type="submit">Submit </button>\n' +
        '</form>\n' +
        '<br>\n' +
        '\n' +
        '<h2>uppercaseFirstandLast</h2>\n' +
        '<form action ="/uppercaseFirstandLast" method="get">\n' +
        '    <label for = "str">Enter a string:</label>\n' +
        '    <input type="text" name="str" id="str">\n' +
        '    <button type="submit">Submit</button>\n' +
        '</form>\n' +
        '<br>\n' +
        '\n' +
        '\n' +
        '<h2>findAverageAndMedian</h2>\n' +
        '<form action ="/findAverageAndMedian" method="get">\n' +
        '    <label for="numbers">Enter numbers sepatated by commas(e.g., 1,2,3,4...):</label>\n' +
        '    <input type="text" name="numbers" id="numbers">\n' +
        '    <button type="submit">Submit</button>\n' +
        '</form>\n' +
        '<br>\n' +
        '\n' +
        '<h2>find4Digits</h2>\n' +
        '<form action="/find4Digits" method = "get" >\n' +
        '    <label for="strDigits">Enter numbers separted by spaces (e.g. "12 12 123 12345"):</label>\n' +
        '    <input type="text" name="str" id="strDigits">\n' +
        '    <button type="submit">Submit</button>\n' +
        '</form>\n' +
        '<br>\n' +
        '</body>\n' +
        '</html>'
    )
});


app.get('/findSummation',(req,res) =>{
    let {n} = req.query;
    n = n ? Number(n) :1 ;
    const result = findSummation(n);
    res.send(`Result of findSummation(${n}) is: ${result}`);
});

app.get('/uppercaseFirstandLast',(req,res) =>{
    const {str} = req.query;
    const result = uppercaseFirstandLast(str);
    res.send(`Result of uppercaseFirstandLast("${str}") is: ${result}`);
});

app.get('/findAverageAndMedian',(req,res) =>{
    let { numbers} = req.query;
    const numArr = numbers.split(',').map( s => Number(s.trim())).filter(val => !isNaN(val));
    const result = findAverageAndMedian(numArr);
    if (result === false){
        res.send("Invalid input !");
    }else{
        res.send(`Result of findAverageAndMedian : Average = ${result.average}, Median = ${result.median}`);
    }
});

app.get('/find4Digits',(req,res)=> {
    const {str} =req.query;
    const result = find4Digits(str);
    res.send(`Result of find4Digits is : ${result}`);
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}. Visit http://localhost:${port} to test the functions.`);
});
console.log('🚀 Server is running !！');

























































































































