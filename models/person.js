const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

//document object with all key/types
const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  surname: { type: String, required: true, minLength: 3 },
  number: { type: Number, required: true },
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // _id property of Mongoose objects looks like a string, but it is an object.Transforms it into a string just to be safe
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
