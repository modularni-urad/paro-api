import express from 'express'

const app = express()

app.post('/', express.json(), (req, res) => {
  res.json(req.body)
})

app.post('/:id', express.json(), (req, res) => {
  res.json(req.body)
})

export default app