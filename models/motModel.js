const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const motSchema = new Schema({
    description: {type: String, required: true,},
    price: {type: Number, required: true,},
    motNumber: {type: Number, required: true},

});

module.exports = MOT =  mongoose.model('MOT', motSchema, 'MOT Subscription');