#!/usr/bin/env node

const me = parseInt(process.env.N || 0),
      nProcs = parseInt(process.env.NPROCS || 4),
      base = parseInt(process.env.PORT || 8000);

console.log(`Hello World from process ${me}/${nProcs}!`);

let crypto = require('crypto'),
    express = require('express'),
    fs = require('fs');
let app = express();

let checksum = (str, algorithm, encoding) =>
  crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');

// reply to request with "Hello World!"
app.get('/', (req, res) => res.send(`Hello World from process ${me}!`));

// Send SHA1 checksum of running application
// TODO: compute checksum of application image in memory
app.get('/checksum', (req, res) =>
  fs.readFile('server.js', (err, data) =>
    res.send(checksum(data, 'sha1'))
  )
);

//start a server on port 8000 + $N and log its start to our console
let server = app.listen(base + me, () =>
  console.log('Example app listening on port ', server.address().port)
);
