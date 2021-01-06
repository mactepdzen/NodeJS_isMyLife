const http = require('http');
const fs = require('fs');
const port = 8080;
const db = 'names_ip.json';

let users = [];

if (fs.existsSync(db)) {
    users = JSON.parse(fs.readFileSync(db, 'utf-8'));
    for (let user of users) {
        console.log(`Hi, ${user.name}, you IP is ${user.ip}`);
    }
}

const requestHandler = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    if (request.method === 'POST') {
        if (request.headers.iknowyoursecret === 'TheOwlAreNotWhatTheySeem') {
            if (request.headers.name) {
                users.push({name: request.headers.name, ip: request.connection.remoteAddress})
                fs.writeFile(db, JSON.stringify(users, null, ' '), err => {
                    if (err) {
                        throw err;
                    }
                });
            }
        } else {
            console.log('Enter the secret.');
        }
    }
    response.end();
}

const server = http.createServer(requestHandler);

server.listen(port, error => {
    if (error) {
        console.log(`And error has occurred: ${error}`);
    } else {
        console.log(`Server is listening on ${port}`);
    }
});
