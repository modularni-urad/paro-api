import { TABLE_NAMES, getQB } from '../consts'

export async function addSupport (project, call, author, schema, knex) {
  const count = await getQB(knex, TABLE_NAMES.PARO_SUPPORT, schema)
      .where({ project_id: project.id }).count('author as a').first()
  const enough = count.a >= call.minimum_support - 1
  if (enough && project.state === 'new') {
    await getQB(knex, TABLE_NAMES.PARO_PROJECT, schema)
      .where({ id: project.id })
      .update({ state: 'supprtd' })
  }
  const body = { project_id: project.id, author: author.id }
  await getQB(knex, TABLE_NAMES.PARO_SUPPORT, schema).insert(body)
  return enough ? 'supprtd' : project.state
}

export async function removeSupport (project, author, schema, knex) {
  if (project.state !== 'new') {
    throw new ErrorClass(400, 'ALREADY_SUPPORTED')
  }
  const cond = { project_id: project.id, author: author.id }
  return getQB(knex, TABLE_NAMES.PARO_SUPPORT, schema).where(cond).del()
}
