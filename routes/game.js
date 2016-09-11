'use strict';

const Player = require('../model/player');
const Game = require('../model/game');

let greet = {
    path: '/api/hello',
    method: 'GET',
    handler: function (request, reply) {
        return reply('Hello ' + (request.query.name || 'Guest') + '!').code(200);
    }
};

let getLeaderboad = {
    path: '/api/leaderboard',
    method: 'GET',
    handler: function (request, reply) {
        Player.find({}, 'name wins', { sort: {wins: -1}}, (err, leaderboard) => {
            if (err) {
                console.error('Error in finding playeres', err.stack);
                return reply(err);
            } else if (leaderboard) {
                let result = [];
                leaderboard.forEach(player => {
                    let temp = [player._id, player.wins];
                    result.push(temp);
                });
                return reply({result}).code(200);
            } else {
                return reply({}).code(200);
            }
        });
    }
};  

module.exports = [greet, getLeaderboad];