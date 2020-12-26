const https = require('https');

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/love',
    method: 'POST',
    headers: {
        'WhatWillSaveWorld': 'love'
    }
}

const req = https.request(options, response => {
    console.log(`Data you wanted to POST: ${response.headers}`)
});

req.on('error', error => {
    console.error(error)
});

req.end();
