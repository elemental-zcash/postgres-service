const pgPromise = require('pg-promise');

const initOptions = {
  capSQL: true,
};

const config = {
  host: 'database',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
};

const pg = pgPromise(initOptions);

const db = pg(config);

const makeDb = (database) => pg({ ...config, database });

module.exports = { pg, makeDb, db };
