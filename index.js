'use strict';

const fs = require('fs');
const protobuf = require('node-protobuf');
var pb = new protobuf(fs.readFileSync("./protobuf/CrazyCriketProto.desc"));
/*
var gameObj = {
    "winner": {
        "userId": "Venkat",
        "country": "India"
    },
    "loser": {
        "userId": "Adil",
        "country": "India"
    },
    "type": "TEST",
    "gameDate": 1473401815000
};
var buf;
try {
    buf = pb.serialize(gameObj, "Game");// you get Buffer here, send it via socket.write, etc.
} catch (e) {
    // will throw if MySchema does not exist
    console.error(e);
}

try {
    var newObj = pb.parse(buf, "Game"); // you get plain object here, it should be exactly the same as obj
    console.log(newObj);
} catch (e) {
    // will throw on invalid buffer or if MySchema does not exist
    console.error(e);
}
*/
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
   // Producer = kafka.Producer,
    client = new kafka.Client('localhost:2181');
   /* producer = new Producer(client),
    payloads = [
        { topic: 'topic1', messages: buf, partition: 0 }
    ];

producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
});
*/
var consumer = new Consumer(
    client,
    [
        { topic: 'TEST', partition: 0 }, { topic: 'TWENTY_TWENTY', partition: 0 }, { topic: 'LIMITED_OVERS', partition: 0 }
        //{ topic: 'topic1', partition: 0 }
    ],
    {
        groupId: 'kafka-node-group',//consumer group id, default `kafka-node-group` 
        // Auto commit config 
        autoCommit: false,
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
//consumer.setOffset(['TEST', 'TWENTY_TWENTY', 'LIMITED_OVERS'], 0, 0);
console.log('Schemas: ', pb.info());
consumer.on('message', message => {
    //console.log(message);
    try {
        var newobj = pb.parse(message.value, "Game");
        console.log("Decoded:", newobj);
    } catch (e) {
        console.error("Error", e);
    }
});