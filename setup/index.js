#!/usr/bin/env node

const fs = require('fs');
const nunjucks = require('nunjucks');

const template = fs.readFileSync('../config.json.template', 'utf-8');

const crypto = require('crypto');

function generateToken(length) {
  const byteLength = Math.ceil((3/4) * length);
  const buffer = crypto.randomBytes(byteLength);
  return buffer.toString('base64').slice(0, length);
}

// TODO: Pass services as an environment variable
const services = ['sso', 'elemental_pay', 'zpublish'];

// TODO: Choose which environments to enable
const environments = ['local', 'testing', 'staging', 'production'];


const main = async () => {
  let data = { databases: {} };
  let envOutput = '';

  for (const service of services) {
    for (const env of environments) {
      const _name = `${service}_${env}`;
      const password = generateToken(96);
      data.databases[_name] = {
        username: _name,
        password: password,
      }
      envOutput += `${_name}=${password}\n`;
    }
  }

  const output = JSON.stringify(JSON.parse(nunjucks.renderString(template, data)), null, 2);
  fs.writeFileSync('../.env', envOutput);
  fs.writeFileSync('../config.json', output);
  fs.writeFileSync('../postgres-manager/config.json', output);
};

main();
