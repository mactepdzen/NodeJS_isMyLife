const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017", {useNewUrlParser: true});

const UserSchema = mongoose.Schema({name: String, password: String, jwt: String});
const User = mongoose.model('Users', UserSchema);

module.exports = {
    User,
}
