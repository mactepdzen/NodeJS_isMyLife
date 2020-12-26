const https = require('https');
const port = 8080;

const requestHandler = (request, response) => {
    if (request.method === 'GET') {
        response.end(`request.method: ${request.method}\nI'm just listening, my lord`);
    } else {
        if (request.method === 'POST') {
            const data = request.body ? request.body : `request.method: ${request.method}\nHehehe, here's no data!`
            response.write(`${data}`);
            response.end();
        }
    }
}

const server = https.createServer(requestHandler);

server.listen(port, error => {
    error ? console.log(`And error has occurred: ${error}`) : console.log(`Server is listening on ${port}`);
});
