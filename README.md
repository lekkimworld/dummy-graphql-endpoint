# Dummy GraphQL Endpoint
Repo with a GraphQL endpoint with some demo data. The repo is work in progress and although it works the data is generated on startup and not persisted. There are additional code in the `src/data_generation.ts` file to write the generated data to various CSV and SQL files.

## Environment variables
* `BEARER_TOKEN` The bearer token if the `Authorization` header starts with `Bearer ` or the username and password if the `Authorization` header starts with `Basic `.
* `PORT` The port to listen on (defaults to 8080).
