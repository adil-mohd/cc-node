#!/bin/bash
kafkaPort=$1
echo $1
echo "node version:" $(node -v)
echo "npm version:" $(npm -v)
echo "mongodb version:" $(mongod --version)
echo "Running npm install to install dependencies... Please wait."
npm install
echo "Starting server... connecting to db"
node server.js $kafkaPort
