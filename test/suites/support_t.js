import { PROJECT_STATE } from '../../consts'

module.exports = (g) => {
  const _ = g.require('underscore')
  const r = g.chai.request(g.baseurl)


  return describe('support', () => {
    //
    it('must not create a new item without auth', async () => {
      const res = await r.post(`/${g.parocall.id}/${g.paroproject.id}/support`)
      res.should.have.status(401)
    })

    it('shall create support', async () => {
      const res = await r.post(`/${g.parocall.id}/${g.paroproject.id}/support`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall delete support', async () => {
      const res = await r.delete(`/${g.parocall.id}/${g.paroproject.id}/support`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall create support again', async () => {
      const res = await r.post(`/${g.parocall.id}/${g.paroproject.id}/support`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall create support as another user -> project supported', async () => {
      g.mockUser.id = 43
      const res = await r.post(`/${g.parocall.id}/${g.paroproject.id}/support`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      const res2 = await r.get(`/${g.parocall.id}`)
      res2.body[0].state.should.eql(PROJECT_STATE.SUPPORTED)
    })
  })
}
