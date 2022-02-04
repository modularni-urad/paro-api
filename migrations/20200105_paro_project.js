import { TABLE_NAMES, PROJECT_STATE, tableName } from '../consts'

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TABLE_NAMES.PARO_PROJECT, (table) => {
    table.increments('id').primary()
    table.integer('call_id').references('id')
      .inTable(tableName(TABLE_NAMES.PARO_CALL)).notNullable()
    table.string('name').notNullable()
    table.string('state', 8).notNullable().defaultTo(PROJECT_STATE.DRAFT)
    table.string('author').notNullable()
    table.string('desc').notNullable()
    table.string('poloha').notNullable()
    table.text('content').notNullable()
    table.json('budget').notNullable()
    table.string('photo')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['author', 'call_id'])
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.dropTable(TABLE_NAMES.PARO_PROJECT)
}
