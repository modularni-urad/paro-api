import { TABLE_NAMES, CALL_STATUS } from '../consts'

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TABLE_NAMES.PARO_CALL, (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.timestamp('submission_start').notNullable()
    table.timestamp('submission_end').notNullable()
    table.timestamp('thinking_start').notNullable()
    table.timestamp('voting_start').notNullable()
    table.timestamp('voting_end').notNullable()
    table.float('budgetlimit').notNullable()
    table.integer('minimum_support').notNullable().default(100)
    table.string('status').notNullable().default(CALL_STATUS.DRAFT)
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.dropTable(TABLE_NAMES.PARO_CALL)
}
