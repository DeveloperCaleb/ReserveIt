/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const {
  NODE_ENV = "development",
  DATABASE_URL = "postgres://vmbtlsjm:VFbbrrMQNT9JKO0M8CMG_2op0AlQBEsM@jelani.db.elephantsql.com/vmbtlsjm",
  DATABASE_URL_DEVELOPMENT = "postgres://dvzqtjtz:kYYkwaVngDvarUl11jEKHwxQ46IvBT5c@jelani.db.elephantsql.com/dvzqtjtz",
  DATABASE_URL_TEST = "postgres://nvhcxeoa:WnqvVeaO2GI7Q2CO_gqAieblRaIctZmi@jelani.db.elephantsql.com/nvhcxeoa",
  DATABASE_URL_PREVIEW = "postgres://ymfomwtt:RFGPNE5u3m99P33Kkntag-Uj-7SK7xNv@jelani.db.elephantsql.com/ymfomwtt",
  DEBUG,
} = process.env;

const URL = NODE_ENV === "production" ? DATABASE_URL : DATABASE_URL_DEVELOPMENT;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
