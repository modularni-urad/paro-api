import { TNAMES, PROJECT_STATE } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.PARO_PROJECT, (table) => {
    table.increments('id').primary()
    table.integer('call_id').references('id').inTable(TNAMES.PARO_CALL).notNullable()
    table.string('name').notNullable()
    table.string('state', 8).notNullable().defaultTo(PROJECT_STATE.NEW)
    table.integer('support_count').notNullable().defaultTo(0)
    table.string('author').notNullable()
    table.string('desc').notNullable()
    table.text('content').notNullable()
    table.text('budget').notNullable()
    table.string('photo')
    table.integer('total').notNullable()
    table.integer('positive_votes')
    table.integer('negative_votes')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['author', 'call_id'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('project')
}
