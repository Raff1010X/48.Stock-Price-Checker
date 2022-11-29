//EDITED
const mongoose = require('mongoose');

//+ Schema for user model
const stockSchema = new mongoose.Schema({
    name: {type: String, required: true},
    ips: [String],
});


module.exports = mongoose.model('Stock', stockSchema);