const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: 5,
    required: true
  },
  date: Date,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner'
  }
})

module.exports = mongoose.model('Todo', todoSchema)