const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://celinedb:${password}@celinedb.cnhm7.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=celinedb`;
//`mongodb+srv://fullstack:${password}@celinedb.o1opl.mongodb.net/?retryWrites=true&w=majority`;
//
/**
 * When the code is run with the command node mongo.js yourPassword, Mongo will add a new document to the database.
 * argv:command to access node args. 
 * argv= [process.execPath, file path, other argspassed to the command]
 ex: node mongo.js toto => [  /usr/local/bin/node, /Users/mjr/work/node/mongo.js,  toto]
 * 
 */

mongoose.set("strictQuery", false);

mongoose.connect(url);

//document object with all key/types
const personSchema = new mongoose.Schema({
  name: String,
  surname: String,
  number: Number,
});

//constructor of a Note document for a notes collection (plutal and lowercase)
// includes the "save " function
// is async
const Person = mongoose.model("Person", personSchema);

// use
const args = process.argv;

switch (args.length) {
  case 2:
    console.log("give password as argument");
    process.exit(1);
  case 3:
    //you need to use model name to indicate collection name (constructor method!!)
    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(person);
      });
      mongoose.connection.close();
    });
    break;
  default:
    const person = new Person({
      name: args[3],
      surname: args[4],
      number: args[5],
    });
    person.save().then((result) => {
      console.log("result", result);
      mongoose.connection.close();
    });
    break;
}
