module.exports = {
    server: {
        host: 'localhost',
        port: 8181
    },
    database: {
        uri: 'mongodb://localhost:27017/crazy-cricket'
    },
    kafkaTopics: [
        { topic: 'TEST', partition: 0 }, { topic: 'TWENTY_TWENTY', partition: 0 }, { topic: 'LIMITED_OVERS', partition: 0 }
    ]
};