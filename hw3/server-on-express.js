const express = require('express');
const app = express();
const fs = require('fs');
const port = 8080;
const db = 'names_ip.json';

let users = [];

if (fs.existsSync(db)) {
    users = JSON.parse(fs.readFileSync(db, 'utf-8'));
    for (let user of users) {
        console.log(`Hi, ${user.name}! Your IP is ${user.ip}`);
    }
}

function getName(request) {
    return request.query.name;
}
function getIP(request) {
    return request.ip;
}

app.post('/', (request, response) => {
    console.log('Wrong path detected.');
    response.end();
});

app.post('/secret', (request, response) => {
    const userName = getName(request);
    const userIP = getIP(request);

    if (userName && request.headers.iknowyoursecret === 'TheOwlAreNotWhatTheySeem') {
        users.push({name: userName, ip: userIP})
        fs.writeFile(db, JSON.stringify(users, null, ' '), err => {
            if (err) {
                throw err;
            }
        });
    } else {
        console.log('Enter the secret.');
    }
    response.end();
});

app.listen(port, error => {
    if (error) {
        console.log(`And error has occurred: ${error}`);
    } else {
        console.log(`Server is listening on ${port}`);
    }
});

