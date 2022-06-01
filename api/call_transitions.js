import axios from 'axios'
import {  TABLE_NAMES, CALL_STATUS, PROJECT_STATE, getQB } from '../consts.js'
const SURVEY_API = process.env.SURVEY_API

export async function switch2Verification (call, knex, schema) {
  // set unsupported those that are new while transition
  await getQB(knex, TABLE_NAMES.PARO_PROJECT, schema)
    .update({ state: PROJECT_STATE.UNSUPPORTED })
    .where({ call_id: call.id, state: PROJECT_STATE.NEW })
  // set new call status
  return getQB(knex, TABLE_NAMES.PARO_CALL, schema)
    .update({ status: CALL_STATUS.VERIFICATION })
    .where({ id: call.id }).returning('*')  
}

export async function switch2Voting (call, knex, schema) {
  // create survey
  const SURVEY_API_URL = SURVEY_API.replace('{{TENANTID}}', schema)
  try {
    const survey = await axios.post(SURVEY_API_URL, {
      name: call.name,
      desc: 'anketa k participativnímu rozpočtu',
      image: 'image1',
      maxpositive: 2,
      maxnegative: 1,
      voting_start: call.voting_start,
      voting_end: call.voting_end
    })
    // create options
    const doable = await getQB(knex, TABLE_NAMES.PARO_PROJECT, schema)
      .where({ call_id: call.id, state: PROJECT_STATE.DOABLE })
    await doable.reduce((acc, i) => {
      const option = {
        title: i.name,
        desc: i.desc,
        link: `/paro/${call.id}/${i.id}`,
        image: i.photo.split(',')[0]
      }
      return acc.then(() => {
        return axios.post(`${SURVEY_API_URL}${survey.data[0].id}`, option)
      })
    }, Promise.resolve())
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error(`SURVEY_API_URL ${SURVEY_API_URL} not works`)
    }
    throw err
  }
  await getQB(knex, TABLE_NAMES.PARO_PROJECT, schema)
    .update({ state: PROJECT_STATE.UNREAL })
    .where({ call_id: call.id, state: PROJECT_STATE.SUPPORTED })
  return getQB(knex, TABLE_NAMES.PARO_CALL, schema)
    .update({ status: CALL_STATUS.VOTING })
    .where({ id: call.id }).returning('*')  
}

export async function switch2Done (call, knex, schema) {
}