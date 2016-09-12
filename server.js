'use strict';

/**
 * @author Adil
 * 
 * Server configuration file that fires up db and api server.
 */

const Hapi = require('hapi');
const server = new Hapi.Server();
const config = require('./config/config');
const mongoose = require('mongoose');
const protobuf = require('./protobuf/protobufClient');
const gameService = require('./service/gameService');

mongoose.connect(config.database.uri);

if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
}

let db = mongoose.connection;

db.on('error', function () {
    console.error('error: ', 'Connection to db failed!');
    process.exit(0);
});

db.on('connected', function callback() {
    console.log('info: ', 'Connected to db...');
    startServer();
});

db.on('disconnected', function (err) {
    console.error('error: ', 'Connection terminated to db');
    process.exit(0);
});

function startServer() {
    server.connection({
        host: config.server.host,
        port: config.server.port,
        routes: {
            cors: true
        }
    });

    server.route(require('./routes/game'));

    server.start(function () {
        startKafkaConsumer();
        console.log('info', 'Server started at: ' + server.info.uri);
    });
}

function startKafkaConsumer() {
    let zookeeperHost = process.argv[2];
    if (!zookeeperHost) {
        zookeeperHost = 'localhost:2181';
        console.log('No zookeeper host provided.. considering default host');
    }
    console.log('Kafka Consumer listening on: ' + zookeeperHost);
    let kafka = require('kafka-node'),
        Consumer = kafka.Consumer,
        client = new kafka.Client(zookeeperHost);

    let consumer = new Consumer(
        client,
        config.kafkaTopics,
        {
            groupId: 'kafka-node-group',//consumer group id, default `kafka-node-group` 
            // Auto commit config 
            autoCommit: true,
            autoCommitIntervalMs: 5000,
            // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms 
            fetchMaxWaitMs: 100,
            // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte 
            fetchMinBytes: 1,
            // The maximum bytes to include in the message set for this partition. This helps bound the size of the response. 
            fetchMaxBytes: 1024 * 1024,
            // If set true, consumer will fetch message from the given offset in the payloads 
            fromOffset: false,
            // If set to 'buffer', values will be returned as raw buffer objects. 
            encoding: 'buffer'
        }
    );

    consumer.setOffset(['TEST', 'TWENTY_TWENTY', 'LIMITED_OVERS'], 0, 0);
    
    consumer.on('message', message => {
        try {
            let gameInfo = protobuf.parse(message.value, "Game");
            console.log(gameInfo);
            gameService.saveGame(gameInfo, (err, game) => {
                if (game) {
                    console.log('Saved game: ' + game);
                }
            });
        } catch (e) {
            console.error("Error", e);
        }
    });

    consumer.on('error', err => {
        console.error('Error in consumer: ', err.stack);
        process.exit(0);
    });
}

module.exports = server;


