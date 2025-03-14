#!/bin/sh
export PGSSLROOTCERT="/tmp/root.crt"
export PGSSLKEY="/tmp/postgresql.key"
export PGSSLCERT="/tmp/postgresql.crt"
export DATABASE_URL=`heroku config:get DATABASE_URL -a young-reef-43874`
psql "${DATABASE_URL}?sslmode=verify-ca" < ~/Programming/repos/dummy-graphql-endpoint/schema.sql
psql "${DATABASE_URL}?sslmode=verify-ca" < ~/Programming/repos/dummy-graphql-endpoint/generated/accounts.sql
psql "${DATABASE_URL}?sslmode=verify-ca" < ~/Programming/repos/dummy-graphql-endpoint/generated/contacts.sql
psql "${DATABASE_URL}?sslmode=verify-ca" < ~/Programming/repos/dummy-graphql-endpoint/generated/shipments.sql
psql "${DATABASE_URL}?sslmode=verify-ca" < ~/Programming/repos/dummy-graphql-endpoint/generated/routes.sql
psql "${DATABASE_URL}?sslmode=verify-ca" < ~/Programming/repos/dummy-graphql-endpoint/generated/cargo.sql
