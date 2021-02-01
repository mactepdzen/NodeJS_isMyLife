require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local');
const BearerStrategy = require('passport-http-bearer');

const app = express();
const port = 8080;

mongoose.connect("mongodb://localhost:27017", {useNewUrlParser: true});

const UserSchema = mongoose.Schema({name: String, password: String, jwt: String});
const User = mongoose.model('Users', UserSchema);

const localStrategy = new LocalStrategy(
    {usernameField: 'username', passwordField: 'password'},
    (username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password != password) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
);

const bearerStrategy = new BearerStrategy((token, done) => {
    User.findOne({token: token}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    })
});

passport.serializeUser((user, done) => {
    const accessToken = jwt.sign({username: user.name}, process.env.SECRET_TOKEN, {expiresIn: '48h'});
    User.updateOne(
        {username: user.name},
        {jwt: accessToken},
        (err, updatedUser) => {
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
