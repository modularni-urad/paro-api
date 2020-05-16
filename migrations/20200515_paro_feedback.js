import _ from 'underscore'
import { TNAMES, FEEDBACKSTATUS } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.PARO_FEEDBACK, (table) => {
    table.increments('id').primary()
    table.integer('project_id').notNullable()
      .references('id').inTable(TNAMES.PARO_PROJECT)
    table.string('author').notNullable()
    table.string('message').notNullable()
    table.enu('status', _.values(FEEDBACKSTATUS)).notNullable()
      .defaultTo(FEEDBACKSTATUS.UNRESOLVED)
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.PARO_FEEDBACK)
}
