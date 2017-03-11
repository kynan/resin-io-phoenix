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
app.get('/', (req, res) => res.send('Hello World!'));

//start a server on port 80 and log its start to our console
let server = app.listen(process.env.PORT || 80, () =>
  console.log('Example app listening on port ', server.address().port)
);
