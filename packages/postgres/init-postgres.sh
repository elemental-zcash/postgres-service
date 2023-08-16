#!/bin/bash

set -e
set -u

function create_user_and_database() {
	local database=$1
	local __SUFFIX=$database
	local db_user=$database
	# local db_user=POSTGRES_DB_USER_$__SUFFIX
	local _db_pswd=POSTGRES_DB_PASSWORD_$__SUFFIX
	set +u
  eval "local db_pswd=\$$_db_pswd"
	set -u
	if [ -z "$db_pswd" ]; then
		db_pswd=$POSTGRES_PASSWORD
	fi
	echo "	Creating user and database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
			CREATE ROLE "$db_user" WITH NOSUPERUSER LOGIN PASSWORD '$db_pswd' ;
			CREATE DATABASE $database;
			GRANT ALL PRIVILEGES ON DATABASE $database TO $db_user;
EOSQL
}


if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		create_user_and_database $db
	done
	echo "Multiple databases created"
fi

# CLI arg - i.e. from npm script arg
if [ -n "$1"] ; then
	echo "Multiple database creation requested: $1"
	for db in $(echo $1 | tr ',' ' '); do
		create_user_and_database $db
	done
	echo "Multiple databases created"
fi
