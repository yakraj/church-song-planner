const express = require("express");
const app = express();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://yakraj:yakraj111@learning.diuqgqs.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const db = client.db("learn");

app.get("/", (req, res) => {
  let collection = "first";

  db.collection(collection)
    .find({})
    .limit(50)
    .toArray()
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => res.send(err).status(400));
});


const port = 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
