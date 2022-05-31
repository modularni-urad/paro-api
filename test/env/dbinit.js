import _ from 'underscore'
import { TABLE_NAMES } from '../../consts'
import { newDb } from 'pg-mem'
const Knex = require('knex')

export default async function initDB () {
  const mem = newDb();
  const knex = mem.adapters.createKnex()
  // const opts = {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: process.env.DATABASE_URL
  //   },
  //   useNullAsDefault: true,
  //   debug: true
  // }
  // const knex = Knex(opts)

  return knex
}
