
export const TABLE_NAMES = {
  PARO_PROJECT: 'paro_proj',
  PARO_CALL: 'paro_call',
  PARO_SUPPORT: 'paro_support',
  PARO_VOTES: 'paro_votes',
  PARO_FEEDBACK: 'paro_feedback'
}

export const CALL_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  VERIFICATION: 'verif',
  VOTING: 'voting',
  DONE: 'done'
}

export const PROJECT_STATE = {
  NEW: 'new',
  SUPPORTED: 'supprtd',
  UNSUPPORTED: 'unsup',
  DOABLE: 'doable',
  UNREAL: 'unreal',
  WILLDO: 'willdo',
  WONTDO: 'wontdo'
}

export const FEEDBACKSTATUS = {
  UNRESOLVED: 'unresolved',
  RESOLVED: 'resolved'
}

export const GROUPS = {
  FEEDBACK: 'paro_feedback',
  ADMIN: 'paro_admins'
}

export function getQB (knex, tablename, schema) {
  return schema
    ? knex(knex.ref(tablename).withSchema(schema))
    : knex(tablename)
}
export function tableName (tname) {
  return process.env.CUSTOM_MIGRATION_SCHEMA 
    ? `${process.env.CUSTOM_MIGRATION_SCHEMA}.${tname}`
    : tname
}