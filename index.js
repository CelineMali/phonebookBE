require('dotenv').config() //tobe required first so global env const are available for other modules
const express = require('express')
const morgan = require('morgan')
const helper = require('./validityHelper')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

const PORT = process.env.PORT || 3001
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

//morgan
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postOnly ',
    {
      skip: function (req) {
        return req.method !== 'POST'
      },
    }
  )
)
app.use(
  morgan('tiny', {
    skip: function (req) {
      return req.method === 'POST'
    },
  })
)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

morgan.token('postOnly', function (req) {
  return JSON.stringify(req.body)
})

// get all persons
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      if (persons) {
        response.json(persons)
      } else {
        response.statusMessage = 'getAll: Nobody found'
        response.status(404).end()
      }
    })
    .catch(function (error) {
      if (error.response) {
        // la requête a été faite et le code de réponse du serveur n’est pas dans
        // la plage 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // la requête a été faite mais aucune réponse n’a été reçue
        // `error.request` est une instance de XMLHttpRequest dans le navigateur
        // et une instance de http.ClientRequest avec node.js
        console.log(error.request)
      } else {
        // quelque chose s’est passé lors de la construction de la requête et cela
        // a provoqué une erreur
        console.log('Error', error.message)
      }
      next(error)
    })
})

// get a single person
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  //sur postman, mettre directement l'id ds l'url de la requete
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.statusMessage = 'No person found'
        response.status(404).end()
      }
    })
    .catch((e) => {
      console.log('error', e)
      next(e)
    })
})
//delete
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      //@todo check result to handle wrong id
      if (result) {
        response.status(204).end()
      }
    })
    .catch((error) => next(error))
})

//update
app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const person = request.body

  const options = {
    new: true, // return the modified document rather than the original
    upsert: true, // if true, and no documents found, insert a new document
    // runValidators: true, //validation not run in findById and update. Need to precise context too.
    // context: "query",
  }
  return Person.findByIdAndUpdate(id, person, options)
    .then((updatedPerson) => {
      return response.json(updatedPerson)
    })
    .catch((e) => {
      console.log('update error', e)
      next(e)
    })
})

//add
app.put('/api/persons', (request, response, next) => {
  const body = request.body
  const validityCheck = helper.checkParamPresence(body)
  if (!validityCheck.valid) {
    return response.status(400).json({
      error: `missing: ${validityCheck.message}`,
    })
  }
  const options = {
    new: true, // return the modified document rather than the original
    upsert: true, // if true, and no documents found, insert a new document
    // runValidators: true,
  }
  const { name, surname, number } = body
  const query = { name, surname }
  const update = { $set: { name, surname, number } }
  return Person.findOneAndUpdate(query, update, options)
    .then((updatedPerson) => {
      return response.json(updatedPerson)
    })
    .catch((e) => {
      console.log('update error', e)
      next(e)
    })
})

/**
 * Provide info about phonebook entries number and request time
 */
//TODO Count Documents NOT WORKING
app.get('/api/persons/info', (request, response) => {
  return Person.countDocuments(request, { hint: 'name' }).then(() => {
    console.log(response)
  })
  // const message = `Phonebook has info for ${
  //   persons.length
  // } people <br/> <br/> ${new Date()}`;
  // response.set("Content-Type", "text/html");
  // response.send(message);s
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
