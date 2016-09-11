'use strict';

const Player = require('../model/player');
const Game = require('../model/game');

function saveGame(gameInfo, cb) {
    let winner = gameInfo.winner;
    winner.$inc = {wins:1};
    let loser = gameInfo.loser;
    loser.$inc = {lost: 1};
    Player.findByIdAndUpdate(winner.userId, winner, {upsert: true, new: true}, (err, player) => {
        if (err) {
            console.error('Error in saving player..\n', err);
            cb(err);
        } else {
            console.log('Player saved: ', player);
        }
    });

    Player.findByIdAndUpdate(loser.userId, loser, {upsert: true, new: true}, (err, player) => {
        if (err) {
            console.error('Error in saving player..\n', err);
            cb(err);
        } else {
            console.log('Player saved: ', player);
        }
    });

    let game = new Game({date: new Date(new Number(gameInfo.gameDate)), gameType: gameInfo.type, winner: winner.userId, loser: loser.userId});
    game.save(err => {
        if(err) {
            console.error('Error in saving game..', err);
            cb(err);
        } else {
            return cb(null, game);
        }
    });
};

module.exports = {
    saveGame
};


