import _ from 'underscore'
import { TABLE_NAMES, FEEDBACKSTATUS, tableName } from '../consts'

exports.up = (knex, Promise) => {
  // return knex.schema.createTable(TABLE_NAMES.PARO_FEEDBACK, (table) => {
  //   table.increments('id').primary()
  //   table.integer('project_id').notNullable()
  //     .references('id').inTable(tableName(TABLE_NAMES.PARO_PROJECT))
  //   table.string('author').notNullable()
  //   table.string('message').notNullable()
  //   table.enu('status', _.values(FEEDBACKSTATUS)).notNullable()
  //     .defaultTo(FEEDBACKSTATUS.UNRESOLVED)
  //   table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  // })
}

exports.down = (knex, Promise) => {
  // const builder = process.env.CUSTOM_MIGRATION_SCHEMA
  //   ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
  //   : knex.schema
  // return builder.dropTable(TABLE_NAMES.PARO_FEEDBACK)
}
