import express from 'express'

const app = express()
let cntr = 0

app.post('/', express.json(), (req, res) => {
  cntr ++
  res.json([Object.assign(req.body, { id: cntr })])
})

app.post('/:id', express.json(), (req, res) => {
  res.json(req.body)
})

export default app