const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true
  },
  passwordHash: String,
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Todo'
    }
  ] 
})

ownerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // passwordHash should not be visible at returned JSON
    delete returnedObject.passwordHash
  }
})

ownerSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Owner', ownerSchema)