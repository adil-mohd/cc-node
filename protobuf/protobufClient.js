'use strict';

const fs = require('fs');
const protobuf = require('node-protobuf');

var pb = new protobuf(fs.readFileSync(__dirname + "/CrazyCricketProto.desc"));

module.exports = pb;