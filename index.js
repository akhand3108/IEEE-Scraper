const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const async = require('async');
let counter = 1;
const root = "https://ieeexplore.ieee.org"
const urlArray = fs.readFileSync('urls.txt', 'utf8');

// Parse the urls as JSON
const urls = JSON.parse(urlArray);
const failed = [];

const q = async.queue((url, callback) => {
    try {
      request(root+url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const script = $("script").filter((i, el) => {
                return $(el).html().includes("xplGlobal.document.metadata=");
            }).html();
          
            const startIndex = script.indexOf("xplGlobal.document.metadata=");
            const endIndex = script.indexOf(";\n\n\n\n\n\n\n\n\n", startIndex);
            const jsonString = script.substring(startIndex, endIndex);  
            try {
              const data = JSON.parse(jsonString.replace("xplGlobal.document.metadata=",""));
            console.log(counter++);
            fs.appendFileSync('data.json', JSON.stringify(data));
            fs.appendFileSync('data.json', ",\n\n");
            } catch (error) {
              fs.appendFileSync('failed.json', JSON.stringify(url));
              fs.appendFileSync('failed.json', ",\n");
            }
            
            callback();
        } else {
            callback();
        }
    });
    } catch (error) {
      console.log(error);
    }
}, 100);

q.push(urls);

