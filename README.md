# CRAZY CRICKET IMPLEMENTATION

## Tech Stack
- Mongodb
- Node.js
- Hapi.js
- Apache kafka
- Protocol Buffer

## Prerequisits
- Mongodb Installed and mongod service running (assuming port: 27017)
- Node.js ~v6.5 and npm ~v3.10
- Kafka broker and zookeeper instance host (which will be passed as argument to run.sh
- Protocol buffer schema description file.

## Starting the server
> `cd` into the root directory of the project where server.js resides

> run:`sh bin/run.sh localhost:2181`

> `localhost:2181` is the default host url of the zookeeper instance, change it if you have it running else where.

This will attempt connection to mongodb, if successful will start polling for kafka messages and also fire up the http server which listens on `localhost:8181`

**Note:** The mongodb connection url and the http server port are configurable in the file `config/config.js`

## API Documentation
> GET **/api/leaderboard**

**Response:** This API will return the current top player and his total wins.
```json
{
    result: [
              ["Sachin", 4],
              ["andrew", 2],
              ["Shubham", 2],
              ["oscar", 1],
              ["imran", 0]
    ]
}
```
> GET **/api/leaderboard?start=yyyyMMdd&end=yyyyMMdd**

**Response:** This API will return the top player between the given dates, in the same json format as above.
> GET **/api/national_leaderboard**

**Response:** This API will return the current top player for a country.
```json
{
    result: [
              ["Sachin", "India],
              ["andrew", "USA"],
              ["Shubham", "India"],
              ["oscar", "England"],
              ["imran", "Pakistan"]
    ]
}
```
> GET **/api/national_leaderboard?start=yyyyMMdd&end=yyyyMMdd**

**Response:** This API will return the top player of a country between the given dates, in the same json format as above.

## Architecture
**Why Mongodb?**
- Mongo is proved to be very fast and effective document store with lot of frameworks that provide easy querying of data.
- Mongodb scales easily and eliminates the need of ORMs.
- Mongodb's flexible data model can be easily evolved as per business needs.
- In the case of crazy cricket, we require a db that plays well with aggregation, hence Mongodb.

> Messages are read off the kafka broker, parsed as protocol buffer schemas and stored into mongodb into 2 seperate collections `Game` and `Player`.

> The Game data such as game date, winner, loser, type are dumped into game schema.
> Whereas in player schema the count of the wins/loses of each individual player is incremented to keep track of total wins on leaderboard.

> I've used mongodb's aggregation framework to query the time based data as required in the 2nd set of APIs.

## Beyond
> This architecture is not perfect and might not scale effectively.
> A different approach will be to consider this as time-series data and generate pre-aggregated mongodb models with the space for each month of data in an year pre-allocated in the document. That way we only have to push the results into that document/sub-document and the aggreagation framework will do the rest for querying it.
