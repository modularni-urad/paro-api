import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.PARO_VOTES, (table) => {
    table.integer('call_id').notNullable()
      .references('id').inTable(TNAMES.PARO_CALL)
    table.integer('proj_id').notNullable()
      .references('id').inTable(TNAMES.PARO_PROJECT)
    table.string('author').notNullable()
    table.integer('value').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['author', 'call_id', 'proj_id'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.PARO_VOTES)
}
