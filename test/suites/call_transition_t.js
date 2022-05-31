import { PROJECT_STATE, CALL_STATUS } from '../../consts'

module.exports = (g) => {
  const _ = g.require('underscore')
  const r = g.chai.request(g.baseurl)
  const p = {
    name: 'paroProject2',
    desc: 'project 2',
    content: 'sample content 2',
    budget: '[]',
    photo: 'photo2',
    poloha: '42,14'
  }

  return describe('call transition', () => {
    //
    it('shall create 1 more projects', async () => {
      const res = await r.post(`/${g.parocall.id}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      g.paroproject2 = res.body[0]
      const res2 = await r.put(`/${g.parocall.id}/${g.paroproject2.id}/publish`)
        .set('Authorization', 'Bearer f')
      res2.should.have.status(200)
    })

    it('shall forward call 2 verification', async () => {
      g.mockUser.groups = [ 'paro_admins' ]
      const res = await r.put(`/${g.parocall.id}/forward`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      res.body.length.should.eql(1)
      res.body[0].status.should.eql(CALL_STATUS.VERIFICATION)
      g.mockUser.groups = _.without(g.mockUser.groups, 'paro_admins')
      const res2 = await r.get(`/${g.parocall.id}`)
      res2.body.length.should.eql(2)
      res2.body[0].state.should.eql(PROJECT_STATE.SUPPORTED)
      res2.body[1].state.should.eql(PROJECT_STATE.UNSUPPORTED)
    })

    it('shall forward call 2 voting', async () => {
      g.mockUser.groups = [ 'paro_admins' ]
      const resSetState = await r.put(`/${g.parocall.id}/${g.paroproject.id}/setstate/doable`)
        .set('Authorization', 'Bearer f')
      resSetState.should.have.status(200)
      const res = await r.put(`/${g.parocall.id}/forward`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      g.mockUser.groups = _.without(g.mockUser.groups, 'paro_admins')
      const res2 = await r.get(`/${g.parocall.id}`)
      res.body.length.should.eql(1)
      res.body[0].status.should.eql(CALL_STATUS.VOTING)
    })

    it('shall forward call 2 done', async () => {
      g.mockUser.groups = [ 'paro_admins' ]
      const res = await r.put(`/${g.parocall.id}/forward`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      g.mockUser.groups = _.without(g.mockUser.groups, 'paro_admins')
      // const res2 = await r.get(`/${g.parocall.id}`)
      // res2.body.length.should.eql(2)
      // res2.body[0].state.should.eql(PROJECT_STATE.SUPPORTED)
    })

  })
}
