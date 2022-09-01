#!/usr/bin/env node

const url = require('url');
const https = require('https');
const request = require('request');
const probe = require('probe-image-size');

function requestImage(wcmid, index) {
  return new Promise((resolve, reject) => {
    console.log("📷 grabbing image aspect", wcmid);

    // Generate the full path
    let hash = parseInt(wcmid).toString(8); // Convert to base 8
    // Make sure to zero pad if it's an odd number
    if (hash.length % 2) { 
      hash = `0${hash}`;
    }
    let hashArray = hash.match(/.{1,2}/g);
    hashArray = hashArray.slice(0, 4);
    hash = hashArray.join("/");

    // Create the image path
    let imgPath = `https://s.hdnux.com/photos/${hash}/${wcmid}/1/`;
    // Buffer a small version of this file to get the aspect:
    // Do not try to optimize the var below by using ${hash} or ${imgPath}, it will not work
    // It opens up some kind of rift in the javascript spacetime continuum 
    let reqUrl = `https://s.hdnux.com/photos/0/0/0/0/${wcmid}/1/100x0.jpg`;

    // First we need the live URL from the redirect
    let makeReq = (reqUrl, num) => {
      if (!num){
        num = 1;
      } else {
        num += 1;
      }
      // Bail out if we've asked too many times
      if (num > 5){
        resolve({ratio: 0.75, wcmid: wcmid, full_path: imgPath});
      } else {
        request({ url: reqUrl, followRedirect: false }, function (err, res, body) {
          // res.headers.location is the final redirect URL
          // if res doesn't exists, throw
          if (res){
            // If we didn't get a location, we can just use the placeholder ratio
            if (!res.headers.location) {
              resolve({ratio: 0.75, wcmid: wcmid, full_path: imgPath});
              return false;
            }
            let options = url.parse(res.headers.location);
            https.get(options, function (response) {
              let chunks = [];
              response.on('data', function (chunk) {
                chunks.push(chunk);
              }).on('end', function() {
                let buffer = Buffer.concat(chunks);
                let sizeData = probe.sync(buffer);
                if (!sizeData){
                  console.log("FATAL GATSBY IMAGE ERROR! NO SIZE DATA FOR " + wcmid, buffer.toString());
                  // If it failed, make it again
                  makeReq(reqUrl, num)
                } else {
                  resolve({ratio: sizeData.height/sizeData.width, wcmid: wcmid, full_path: imgPath});
                }
              });
            });
          } else {
            console.log("FATAL GATSBY IMAGE ERROR! NO RES FROM HDNUX");
            // If it failed, make it again
            makeReq(reqUrl, num)
          }
        });
      }
    }

    // Use request library to get the actual redirected location
    makeReq(reqUrl)
  })
}


module.exports = { requestImage };