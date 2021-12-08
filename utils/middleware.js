const logger = require('./logger')

const requestLogger = (request, response, next) => {
    const date = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    const method = request.method
    const url = request.url
    const text = `${date}: ${method} ${url}`
    logger.log(text)
    next()
  }

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).json({ error: 'Mallformed MongoDB id' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  errorHandler
}
