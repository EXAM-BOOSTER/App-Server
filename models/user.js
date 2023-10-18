const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDetails = new Schema({
    name: {type: String, required: true,},
    email: {type: String, required: true, unique: true},
    password: {type: String,  },

});

module.exports = user =  mongoose.model('User', userDetails, 'UserDetails');