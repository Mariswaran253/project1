const http = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");
const url = require("url");
// const { exec } = require('child_process');
// const getDiffError = require('./tools/getDiffError');
var connect = require("connect");

var server = http.createServer(function (req, res) { 
    const parsedURL = url.parse(req.url, true);
    if (parsedURL.pathname == '/data') {
        var queryObject = parsedURL.query;
        var fromBranch = queryObject.frombranch;
        var toBranch = queryObject.toBranch;
        getDiffError.execute(fromBranch,toBranch).then((data)=>{
            res.writeHead(200,{'Content-Type':'application/json'}); //no i18n
            res.write(JSON.stringify({ message: data}));  
            res.end();
        });
    }
    else{
        var filePath = parsedURL.pathname == '/' ? '../master/test1.js' : '../master/test2.js'+parsedURL.pathname
        var extname = path.extname(filePath);
        var contentType = 'text/html'; //no i18n
        switch (extname) {
            case '.js':
                contentType = 'text/javascript'; //no i18n
                break;
            case '.css':
                contentType = 'text/css'; //no i18n
                break;
            case '.json':
                contentType = 'application/json'; //no i18n
                break;
            case '.png':
                contentType = 'image/png'; //no i18n
                break;      
            case '.jpg':
                contentType = 'image/jpg'; //no i18n
                break;
            case '.wav':
                contentType = 'audio/wav'; //no i18n
                break;
            case '.svg':
                contentType = 'image/svg'; //no i18n
                break;
        }
        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT'){
                    res.writeHead(200, { 'Content-Type': contentType }); //no i18n
                    res.end('Wrong address', 'utf-8'); //no i18n
                }
                else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: '+error.code+' ..\n'); //no i18n
                    res.end(); 
                }
            }
            else {
                res.writeHead(200, { 'Content-Type': contentType }); //no i18n
                res.end(content, 'utf-8'); //no i18n
            }
        });
    }
}).listen(8090);
