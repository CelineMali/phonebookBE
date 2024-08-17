const express = require("express");
const helper = require("./validityHelper");
const app = express();

app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto",
    surname: "Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada",
    surname: "Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan",
    surname: "Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary",
    surname: "Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return String(Math.floor(Math.random() * 10000));
};

// get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
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

//get info
app.get("/info", (request, response) => {
  const message = `Phonebook has info for ${
    persons.length
  } people <br/> <br/> ${new Date()}`;
  response.set("Content-Type", "text/html");
  response.send(message);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
