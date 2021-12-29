
module.exports = (g) => {
  const _ = g.require('underscore')
  const moment = g.require("moment")
  const r = g.chai.request(g.baseurl)
  const p = {
    name: 'pokus',
    submission_start: moment().add(1, 'hours'),
    submission_end: moment().add(1, 'days'),
    thinking_start: moment().add(7, 'days'),
    voting_start: moment().add(10, 'days'),
    voting_end: moment().add(14, 'days'),
    minimum_support: 2
  }

  return describe('PARO calls', () => {
    //
    it('must not create a new item wihout auth', async () => {
      const res = await r.post('/').send(p)
      res.should.have.status(401)
    })

    it('must not create a new item without mandatory item', async () => {
      g.mockUser.groups = [ 'paroadmin' ]
      const res = await r.post('/').send(_.omit(p, 'submission_start'))
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item', async () => {
      const res = await r.post('/').send(p).set('Authorization', 'Bearer f')
      res.should.have.status(200)
      res.should.have.header('content-type', /^application\/json/)
      const res2 = await r.get(`/`)
      g.parocall = res2.body[0]
    })

    it('shall update the item pok1', async () => {
      const change = {
        name: 'changed'
      }
      const res = await r.put(`/${g.parocall.id}`).send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get the groups', async () => {
      const res = await r.get(`/`)
      res.body.length.should.eql(1)
      res.body[0].name.should.eql('changed')
      res.body[0].status.should.eql('draft')
      res.should.have.status(200)
    })
    
  })
}
