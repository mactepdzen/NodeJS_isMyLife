const http = require('http');

const options = {
    hostname: 'localhost',
    port: 8080,
    method: 'POST',
    headers: {
        'name': 'David Lynch',
        'IKnowYourSecret': 'TheOwlAreNotWhatTheySeem'
    }
}

const req = http.request(options, response => {
    console.log(`The main secret: ${options.headers.IKnowYourSecret}`)
});

req.on('error', error => {
    console.error(error)
});

req.end();
