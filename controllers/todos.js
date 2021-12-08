const todosRouter = require('express').Router()
const { response, request } = require('express')
const Todo = require('../models/todo')
const Owner = require('../models/owner')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// POST add todo
todosRouter.post('/', async (request, response) => {
  const body = request.body

  // find owner by token
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Owners stoken missing or invalid!' })
  }
  const owner = await Owner.findById(decodedToken.id)

  // find owner by id only - NOT with token
  // const owner = await Owner.findById(body.ownerId)

  if (!owner) {
    response.status(400).send({ error: 'Owner is not found' })
  } else {
    const todo = new Todo({
      text: body.text,
      date: new Date(),
      owner: owner._id
    })

    const savedTodo = await todo.save()
    owner.todos = owner.todos.concat(savedTodo._id)
    await owner.save()
    response.json(savedTodo)
  }

})

todosRouter.get('/', (request, response) => {
    Todo.find({}).then(todos => {
      response.json(todos)
    })
  })


todosRouter.get('/:id', async (request, response, next) => {
    try {
        const todo = await Todo.findById(request.params.id)

        if (todo) response.json(todo)
        else response.status(404).end()
    } catch(error) {
        next(error)
    }

    })

todosRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    
    const todo = {
        text: body.text,
        date: new Date()
    }
    
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(request.params.id, todo, { new: true })
        if (updatedTodo) response.json(updatedTodo)
        else response.status(404).end()
    } catch(error) {
        next(error)
    }
    })


todosRouter.delete('/:id', (request, response, next) => {
  // find todo owner by token
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Owners token missing or invalid!' })
  }

  // remove todo if todo id is correct and owner owns it
  Todo.findByIdAndRemove({_id: request.params.id, owner: decodedToken.id})
    .then(deletedTodo => {
      response.json(deletedTodo)
    })
    .catch(error => next(error))
})

todosRouter.delete('/', async (request, response, next) => {
    const info = await Todo.deleteMany({})
    if (info) response.json(info)
    else response.status(404).end()
})

module.exports = todosRouter