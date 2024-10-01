require("dotenv").config(); //tobe required first so global env const are available for other modules
const express = require("express");
const morgan = require("morgan");
const helper = require("./validityHelper");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

//morgan
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postOnly ",
    {
      skip: function (req) {
        return req.method !== "POST";
      },
    }
  )
);
app.use(
  morgan("tiny", {
    skip: function (req) {
      return req.method === "POST";
    },
  })
);

morgan.token("postOnly", function (req) {
  return JSON.stringify(req.body);
});

let persons = [];

const generateId = () => {
  return String(Math.floor(Math.random() * 10000));
};

// get all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// get a single person
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "No person found";
    response.status(404).end();
  }
});
//delete
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

//add
app.post("/api/persons", (request, response) => {
  const body = request.body;
  const validityCheck = helper.checkParamPresence(body);
  if (!validityCheck.valid) {
    return response.status(400).json({
      error: `missing: ${validityCheck.message}`,
    });
  }
  const alreadyExist = persons.find(
    (person) => person.name === body.name && person.surname === body.surname
  );
  if (alreadyExist) {
    return response.status(400).json({
      error: "name and surname should be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

/**
 * Provide info about phonebook entries number and request time
 */
app.get("/info", (request, response) => {
  const message = `Phonebook has info for ${
    persons.length
  } people <br/> <br/> ${new Date()}`;
  response.set("Content-Type", "text/html");
  response.send(message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
