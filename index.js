// follow modules loaded via `npm i --save request`
const request = require('request');
const http = require('http');

const icon = "i5130"
var muniStop = "13911"

http.createServer((req, res) => {
  getDueTimes().then(data => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(data));
  }).catch(error => {
    console.error(error);
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error }));
  });
}).listen(3000);


function getDueTimes() {
  // we're returning a promise so we can later reuse in
  // a web server
  return new Promise((resolve, reject) => {
    // make a GET request to get a page of the next due buses
    request({
      url: 'http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=sf-muni&stopId=' + muniStop
    }, (error, res, body) => {
      // if there was something wrong with the request, print it
      // out and exit the function
      if (error) {
        return reject(error);
      }

      var parsed = JSON.parse(body);
      var timeArray = parsed["predictions"][0]["direction"]["prediction"];

      var lametric = {};
      lametric.frames = [];

      for(var index in timeArray) {
        var timeSlot = {};
        timeSlot.text = timeArray[index]["minutes"];
        timeSlot.icon = icon;
        lametric.frames.push(timeSlot);
      }

      resolve(lametric);
    });
  });
}
