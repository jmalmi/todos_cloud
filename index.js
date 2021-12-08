const config = require('./utils/config')
const express = require('express')
var cors = require('cors')
require('express-async-errors') 
const app = express()
app.use(cors())
const todosRouter = require('./controllers/todos')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const ownersRouter = require('./controllers/owners')
const loginRouter = require('./controllers/login')


const mongoose = require('mongoose')
const { request } = require('express')
logger.log('Connecting to MongoDb')

mongoose.connect(config.MONGODB_URI, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        //useFindAndModify: false,
        //useCreateIndex: true
    })
    .then(() => {
        logger.log('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message)
    })


app.use(middleware.requestLogger)
app.use(express.json())
app.use('/todos', todosRouter)
app.use(middleware.errorHandler)
app.use('/owners', ownersRouter)
app.use('/login', loginRouter)

// Listening port
app.listen(config.PORT, () => {
    logger.log(`Todos app listening on port ${config.PORT}`)
})