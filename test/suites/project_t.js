module.exports = (g) => {
  const _ = g.require('underscore')
  const r = g.chai.request(g.baseurl)

  const p = {
    name: 'paroProject1',
    desc: 'project',
    content: 'sample content',
    budget: '[]',
    photo: 'jflsjfls',
    poloha: '41,14'
  }

  return describe('PARO projects', () => {
    //
    it('must not create a new item without auth', async () => {
      const res = await r.post(`/${g.parocall.id}`).send(p)
      res.should.have.status(401)
    })

    it('must not create a new item coz call not open', async () => {
      const res = await r.post(`/${g.parocall.id}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall open the call', async () => {
      g.mockUser.groups = [ 'paro_admins' ]
      const res = await r.put(`/${g.parocall.id}/start`)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      g.mockUser.groups = _.without(g.mockUser.groups, 'paro_admins')
    })

    it('must not create a new item without mandatory item', async () => {
      const res = await r.post(`/${g.parocall.id}`).send(_.omit(p, 'name'))
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item pok1', async () => {
      const res = await r.post(`/${g.parocall.id}`).send(p)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
      res.should.have.header('content-type', /^application\/json/)
    })

    it('shall get PARO projects', async () => {
      const res = await r.get(`/${g.parocall.id}`)
      res.should.have.status(200)
      res.body.length.should.eql(1)
      res.body[0].name.should.eql(p.name)
      g.paroproject = res.body[0]
    })

    it('shall update the item pok1', async () => {
      const change = {
        name: 'pok1changed'
      }
      const res = await r.put(`/${g.parocall.id}/${g.paroproject.id}`)
        .send(change).set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get the projects', async () => {
      const res = await r.get(`/${g.parocall.id}`)
      res.body.length.should.eql(1)
      res.body[0].name.should.eql('pok1changed')
      res.should.have.status(200)
    })
  })
}
