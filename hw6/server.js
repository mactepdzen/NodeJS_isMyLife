require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local');
const BearerStrategy = require('passport-http-bearer');

const strategies = require('./strategies');
const db = require('./database');

const User = db.User;
const app = express();
const port = 8080;

const localStrategy = new LocalStrategy(
    {usernameField: 'username', passwordField: 'password'},
    strategies.localStrategy
);

const bearerStrategy = new BearerStrategy(strategies.bearerStrategy);

passport.serializeUser((user, done) => {
    const accessToken = jwt.sign(
        {username: user.name}, process.env.SECRET_TOKEN,
        {expiresIn: '48h'}
        );
    User.updateOne({username: user.name}, {jwt: accessToken})
        .exec()
        .then((err, updatedUser) => {
            done(null, updatedUser);
        }
    );
});
passport.deserializeUser((user, done) => {
    done(null, user)
});


app.use(bodyParser.json());
passport.use('local', localStrategy);
passport.use('bearer', bearerStrategy);
app.use(passport.initialize());

app.post('/token', passport.authenticate(
    'local',
    {
        successRedirect: '/success',
        failureRedirect: '/failure'
    })
);

app.get('/:name', passport.authenticate(
    'bearer',
    {session: false}), (req, res) => {
        console.log(`Sup ${req.user.name}, we know your JWT ${req.user.jwt}`);
        res.end();
    }
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    User.find({}, (error, users) => {
        console.log(
            'At the moment in DB:\n',
            users.map(u => u.name + ' ' + u.jwt).join('\n')
        );
    });
});
