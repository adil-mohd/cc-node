'use strict';

const Player = require('../model/player');
const Game = require('../model/game');
const moment = require('moment');

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
        if (request.query.start && request.query.end) {
            Game.aggregate(
                [
                    {
                        $match: {
                            $and: [{ date: { $gte: moment(request.query.start).toDate() } },
                                { date: { $lte: moment(request.query.end).toDate() } }]
                        }
                    },
                    {
                        $group: {
                            _id: "$winner",
                            wins: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { wins: -1 }
                    }
                ], (err, results) => {
                    if (err) {
                        console.error(err.stack);
                        return reply(err);
                    } else {
                        let result = [];
                        results.forEach(player => {
                            let temp = [player._id, player.wins];
                            result.push(temp);
                        });
                        console.log(JSON.stringify(results));
                        return reply({ result }).code(200);
                    }
                }
            );
        } else {
            Player.find({}, 'name wins', { sort: { wins: -1 } }, (err, leaderboard) => {
                if (err) {
                    console.error('Error in finding players', err.stack);
                    return reply(err);
                } else if (leaderboard) {
                    let result = [];
                    leaderboard.forEach(player => {
                        let temp = [player._id, player.wins];
                        result.push(temp);
                    });
                    return reply({ result }).code(200);
                } else {
                    return reply({}).code(200);
                }
            });
        }
    }
};

let getNationalLeaderboard = {
    path: '/api/national_leaderboard',
    method: 'GET',
    handler: function (request, reply) {
        if (request.query.start && request.query.end) {
            Game.aggregate(
                [
                    {
                        $match: {
                            $and: [{ date: { $gte: moment(request.query.start).toDate() } },
                                { date: { $lte: moment(request.query.end).toDate() } }]
                        }
                    },
                    {
                        $group: {
                            _id: "$winner",
                            wins: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { wins: -1 }
                    }
                ], (err, results) => {
                    if (err) {
                        console.error(err.stack);
                        return reply(err);
                    } else {
                        let userIds = [];
                        results.forEach(player => {
                            userIds.push(player._id);
                        });
                        Player.aggregate([
                            {
                                $match: { _id: { $in: userIds } }
                            }, {
                                $group: {
                                    _id: "$country",
                                    player: {
                                        "$first": "$_id"
                                    },
                                    wins: {
                                        $sum: 1
                                    }
                                }
                            }, {
                                $sort: { wins: -1 }
                            }
                        ], (err, results) => {
                            if (err) {
                                console.error(err.stack);
                                return reply(err);
                            } else {
                                console.log(results);
                                let result = [];
                                results.forEach(player => {
                                    let temp = [player._id, player.player];
                                    result.push(temp);
                                });
                                console.log(JSON.stringify(results));
                                return reply({ result }).code(200);
                            }
                        });
                    }
                });
        } else {
            Player.aggregate([
                {
                    $group: {
                        _id: "$country",
                        player: {
                            "$first": "$_id"
                        },
                        wins: {
                            $sum: 1
                        }
                    }
                }, {
                    $sort: { wins: -1 }
                }
            ], (err, results) => {
                if (err) {
                    console.error(err.stack);
                    return reply(err);
                } else {
                    console.log(results);
                    let result = [];
                    results.forEach(player => {
                        let temp = [player._id, player.player];
                        result.push(temp);
                    });
                    console.log(JSON.stringify(results));
                    return reply({ result }).code(200);
                }
            });
        }
    }
};

module.exports = [greet, getLeaderboad, getNationalLeaderboard];