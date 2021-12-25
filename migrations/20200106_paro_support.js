import { TABLE_NAMES } from '../consts'

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TABLE_NAMES.PARO_SUPPORT, (table) => {
    table.integer('project_id').notNullable()
      .references('id').inTable(TABLE_NAMES.PARO_PROJECT)
    table.string('author').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['author', 'project_id'])
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.dropTable(TABLE_NAMES.PARO_SUPPORT)
}
