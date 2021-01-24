const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8080;

mongoose.connect("mongodb://localhost:27017");
const UserSchema = mongoose.Schema({name: String, ip: String});
const User = mongoose.model('Users', UserSchema);

function getName(request) {
    return request.query.name;
}
function getIP(request) {
    return request.ip;
}

app.use((request, response, next) => {
    const userName = getName(request);

    if (request.method === 'POST') {
        console.log(`Welcome to my tavern, ${userName}!`);
        next();
    } else {
        response.end('Wrong request.');
    }
})

app.post('/', (request, response) => {
    const userName = getName(request);
    const userIP = getIP(request);
    const user = new User({name: userName, ip: userIP});

    if (userName && request.headers.iknowyoursecret === 'TheOwlAreNotWhatTheySeem') {
        user.save((error, savedUser) => {
            if (error) {
                throw error;
            }
            response.end(`Hello there, ${savedUser.name}! Your ip is ${savedUser.ip}\n`)
        })
    } else  {
        response.end('Seems like you don`t know the secret or you didn`t introduce yourself.\n');
    }
});

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
    User.find({}, (err, users) => {
        console.log(
            'Recorded users:',
            users.map(user => `username: ${user.name}; ip: ${user.ip}\n`).join('')
        );
    })
});

