# postgres-service
[WIP] Dockerised Postgres service for Elemental Zcash app back-ends

May use PostgREST or Postgraphile in the future, but for now using a more raw SQL approach with `elemental-orm`.

## Getting Started

Create a network

```sh
docker network create elemental_net
```

Generating a password for a project

```sh
echo $(openssl rand -base64 72 -out /dev/stdout | sed -r 's/[^a-zA-Z0-9]//g' | tr -d '\n')
```

Environment variable config:

`.env`

```sh
POSTGRES_USER=elemental_zcash
POSTGRES_PASSWORD=#- ENTER A SECURE PASSWORD HERE, 50+ characters, firewall the Postgres port and implement auth rate limiting -#
```
