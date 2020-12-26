const https = require('https');

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/',
    method: 'POST',
}

const req = https.request(options, response => {
    console.log(`Data you wanted to POST: ${options}`)
});

req.on('error', error => {
    console.error(error)
});

req.end();
