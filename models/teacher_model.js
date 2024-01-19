const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherDetails = new Schema({
    name: {type: String, required: true,},
    email: {type: String, required: true, unique: true},
    password: {type: String,  },        
    profession: {type: Boolean, default: false},
    MOT: {type: Number, default: 5},

});

module.exports = Teacher =  mongoose.model('Teacher', teacherDetails, 'Teacher Details');