'use strict';

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

var schema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    gameType: {
        type: String,
        required: true
    },
   winner: {
       type: String,
       ref: 'player',
       required: true
   },
   loser: {
       type: String,
       ref: 'player',
       required: true
   }
});

schema.plugin(timestamps);

module.exports = mongoose.model('game', schema);