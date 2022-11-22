const http = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");
const url = require("url");
// const { exec } = require('child_process');
// const getDiffError = require('./tools/getDiffError');
var connect = require("connect");

http.createServer(function(req, res) {
    res.write("RUN");
}).listen(8000);
