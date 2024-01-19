const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDetails = new Schema({
    name: {type: String, required: true,},
    email: {type: String, required: true, unique: true},
    password: {type: String,  },
    purchasedSeries: {type: Array, default: [], _id: false},
    enrolledFor: {type: String, default: "", required: true},
    profession: {type: Boolean, default: true},    

});

module.exports = user =  mongoose.model('User', userDetails, 'UserDetails');