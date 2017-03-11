#!/usr/bin/env node

const me = parseInt(process.env.N || 0),
      nProcs = parseInt(process.env.NPROCS || 4),
      base = parseInt(process.env.PORT || 8000);

console.log(`Hello World from process ${me}/${nProcs}!`);

let crypto = require('crypto'),
    express = require('express'),
    fs = require('fs'),
    request = require('request');
let app = express();

let checksum = (str, algorithm, encoding) =>
  crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');

let check = (file, cb) => {
  fs.readFile(file, (err, data) => {
    cb(checksum(data, 'sha1'))
  })
};

let ping = (next, checksum) => {
  const url = `http://localhost:${base + next}/checksum`
  console.log(`Process ${me} pinging process ${next} at ${url}`);
  request(url, (err, res, body) => {
    if (err)
      console.error(`Process ${next} unhealthy`, err);
    else if (body === checksum)
      console.log(`Process ${next} healthy: got expected checksum ${body}`);
    else
      console.error(`Process ${next} unhealthy: got checksum ${body}, expected ${checksum}`);
  });
  setTimeout(ping, 1000, (next + 1) % nProcs, checksum);
};

// reply to request with "Hello World!"
app.get('/', (req, res) => res.send(`Hello World from process ${me}!`));

// Send SHA1 checksum of running application
// TODO: compute checksum of application image in memory
app.get('/checksum', (req, res) => {
  check('server.js', (data) => {
    res.send(data);
  })
});

// Compute checksum
check('server.js', checksum => {
  // Ping other processes round robin once per second
  setTimeout(ping, 1000, (me + 1) % nProcs,  checksum);
});


//start a server on port 8000 + $N and log its start to our console
let server = app.listen(base + me, () =>
  console.log('Example app listening on port ', server.address().port)
);
