require('dotenv').config()
const mongoose = require('mongoose')
// you need to prefix env variable with REACT_APP_ !!!
// eslint-disable-next-line no-undef
const url = REACT_APP_MONGODB_URI || MONGODB_URI

mongoose.set('strictQuery', false)
mongoose
  .connect(url)
  .then(() => {
    console.warn('connected to MongoDB')
  })
  .catch((error) => {
    console.log(
      'error connecting to MongoDB:',
      error.message,
      url,
      process.env.MONGODB_URI
    )
  })

//document object with all key/types
const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  surname: { type: String, required: true, minLength: 3 },
  number: { type: Number, required: true },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // _id property of Mongoose objects looks like a string, but it is an object.Transforms it into a string just to be safe
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
