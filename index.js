const express = require("express");
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
  const maxId =
    persons.length > 0
      ? persons.reduce((acc, current) => {
          acc = acc > Number(current.id) ? acc : Number(current.id);
          return acc;
        }, 0)
      : 0;
  return String(maxId + 1);
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

  if (!body.name) {
    return response.status(400).json({
      error: "missing name",
    });
  }
  if (!body.surname) {
    return response.status(400).json({
      error: "missing surname",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "missing number , ",
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

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
