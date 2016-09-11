'use strict';

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

let schema = new mongoose.Schema({
    _id: {
        type: String,
        lowercase: true
    },
    country: {
        type: String,
        required: true
    },
    wins: {
        type: Number,
        default: 0
    },
    lost: {
        type: Number,
        default: 0
    },
    draws: {
        type: Number,
        default: 0
    }
});

schema.plugin(timestamps);

module.exports = mongoose.model('player', schema);