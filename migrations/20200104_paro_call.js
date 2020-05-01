import { TNAMES, CALL_STATUS } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.PARO_CALL, (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.timestamp('submission_start').notNullable()
    table.timestamp('submission_end').notNullable()
    table.timestamp('thinking_start').notNullable()
    table.timestamp('voting_start').notNullable()
    table.timestamp('voting_end').notNullable()
    table.integer('minimum_support').notNullable().default(100)
    table.float('allocation').notNullable()
    table.string('status').notNullable().default(CALL_STATUS.DRAFT)
    table.integer('positive_votes')
    table.integer('negative_votes')
    table.integer('total_positive_votes')
    table.integer('total_negative_votes')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.PARO_CALL)
}
