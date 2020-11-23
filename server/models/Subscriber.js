const mongoose = require('mongoose');
const { User } = require('./User');

const SubscriberSchema = mongoose.Schema({
    userTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    userFrom : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }

}, { timestamps : true})

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);
module.exports = { Subscriber }