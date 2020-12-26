const https = require('https');

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/greeting',
    method: 'GET',
}

const request = https.request(options, res => {
    console.log(`Data you wanted to GET: ${res.statusCode}`);
})

request.on('error', error => {
    console.error(error)
})

request.end('hi!')
