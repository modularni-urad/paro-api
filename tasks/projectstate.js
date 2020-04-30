import schedule from 'node-schedule'
import { TNAMES, CALL_STATUS, PROJECT_STATE } from '../consts'

export default function (knex) {
  sched()
  async function sched () {
    const currCall = await _getCurrent()
    if (!currCall) return
    switch (currCall.status) {
      case CALL_STATUS.OPEN:
        schedule.scheduleJob(currCall.submission_end, endUnsuffientlySupported)
        break
      case CALL_STATUS.VERIFICATION:
        schedule.scheduleJob(currCall.thinking_start, endUnrealizable)
        break
      case CALL_STATUS.THINKING:
        schedule.scheduleJob(currCall.voting_start, startVoting)
        break
      case CALL_STATUS.VOTING:
        schedule.scheduleJob(currCall.voting_end, endVoting)
        break
    }
  }

  async function endUnsuffientlySupported () {
    const currCall = await _getCurrent()
    await currCall.update({ status: CALL_STATUS.VERIFICATION })
    const unsupported = knex(TNAMES.PARO_PROJECT).select('id')
      .where({ call_id: currCall.id }).whereNot({ state: PROJECT_STATE.NEW })
    await knex(TNAMES.PARO_PROJECT).where('id', 'in', unsupported)
      .update({ status: PROJECT_STATE.UNSUPPORTED })
    sched()
  }

  async function endUnrealizable () {
    const currCall = await _getCurrent()
    await currCall.update({ status: CALL_STATUS.THINKING })
    sched()
  }

  async function startVoting () {
    const currCall = await _getCurrent()
    await currCall.update({ status: CALL_STATUS.VOTING })
    sched()
  }

  async function endVoting () {
    const currCall = await _getCurrent()
    // TODO: count votes
  }

  async function _getCurrent () {
    const res = await knex(TNAMES.PARO_CALL).whereNot({ status: CALL_STATUS.DONE })
    return res.length ? res[0] : null
  }
}
