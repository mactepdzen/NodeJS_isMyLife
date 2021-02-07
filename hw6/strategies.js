const db = require('./database');
const User = db.User;

function localStrategy (username, password, done) {
    User.findOne({username: username}).exec().then((err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (user.password !== password) {
            return done(null, false);
        }
        return done(null, user);
    });
};

function bearerStrategy (token, done) {
    User.findOne({token: token}).exec().then((err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    })
};

module.exports = {
    localStrategy,
    bearerStrategy,
}
