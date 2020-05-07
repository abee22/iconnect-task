const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    full_name: String,
    mobile: String,
    username: String,
    password: String,
});

module.exports = mongoose.model('User', UserSchema);