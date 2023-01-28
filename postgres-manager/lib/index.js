const { db } = require('./pg');

let configJson;

try {
  configJson = require('../config.json');
} catch (err) {
  configJson = {};
}




const main = async () => {
  const { databases } = configJson || {};

  if (!databases) {
    throw new Error('config.json not found');
  }

  try {
    // FIXME: Find a way to cancel/throw error on failure
    // await db.tx(async (t) => {
      for (const databaseName in databases) {
        const database = databases[databaseName];
        const { username, password } = database;

        if ((username || databaseName) && password) {
        // $n:raw is trusted hardcoded input
          const roleExists = await db.any("SELECT * from pg_user where usename = '$1:raw'", [username || databaseName]);

          if (!roleExists || (Array.isArray(roleExists) && roleExists.length === 0)) {
            await db.none(`CREATE ROLE $1:raw WITH NOSUPERUSER LOGIN PASSWORD $2`, [username || databaseName, password]);
            await db.none('CREATE DATABASE $1:name', [databaseName]);
            await db.none('GRANT ALL PRIVILEGES ON DATABASE $1:name TO $2:raw', [databaseName, username || databaseName]);
          }
        } else if (username && !password) {
          throw new Error('Missing password');
        }
      }
    // });


    // success;
    console.log('Success!');
  } catch (error) {
    // FIXME: Find a nicer way to test for databases already existing after first initialisation
    if (!error.message.includes('already exists')) {
      console.log('ERROR:', error);
    }
  }
};

main();
