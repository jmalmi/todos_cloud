const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const Owner = require('../models/owner')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const owner = await Owner.findOne({ name: body.owner })
  const passwordCorrect = owner === null
    ? false
    : await bcrypt.compare(body.password, owner.passwordHash)

  if (!(owner && passwordCorrect)) {
    return response.status(401).json({
      error: 'Name or password is invalid.'
    })
  }

  const ownerForToken = {
    name: owner.name,
    id: owner._id,
  }

  const token = jwt.sign(ownerForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, name: owner.name, id: owner.id})
})


module.exports = loginRouter