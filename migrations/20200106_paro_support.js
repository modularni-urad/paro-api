import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.PARO_SUPPORT, (table) => {
    table.integer('project_id').notNullable()
      .references('id').inTable(TNAMES.PARO_PROJECT)
    table.string('author').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['author', 'project_id'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.PARO_SUPPORT)
}
