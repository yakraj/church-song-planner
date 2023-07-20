const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://immanuel:yakraj123@immanuelchurch.vk9ottj.mongodb.net/?retryWrites=true&w=majority";

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

const db = client.db("immanuel");

app.get("/", (req, res) => {
  let collection = "users";
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    console.log();
  });
  db.collection(collection)
    .find({})
    .limit(50)
    .toArray()
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => res.send(err).status(400));
});

app.get("/register", (req, res) => {
  // const { name, phone, password } = req.body
  let name = "yakraj";
  let phone = 7709522405;
  let password = "yakraj@#111000";
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      res.send("something went wrong").status(502);
    } else {
      const username = uniqid(name);
      db.collection("users")
        .find({ phone: phone })
        .toArray()
        .then((response) => {
          if (!response.length) {
            db.collection("users")
              .insertOne({
                name: name,
                phone: phone,
                userid: username,
                pass: hash,
              })
              .then((respo) => {
                res.send(respo);
              })
              .catch((err) => res.send(err).status(400));
          } else {
            res.send("mobile number already exists");
          }
        })
        .catch((err) => res.send(err).status(400));
    }
  });
});

app.get("/login", (req, res) => {
  // const {phone,password}  = req.body;
  let phone = 7709522405;
  let password = "yakraj@#111000";
  db.collection("users")
    .find({ phone: phone })
    .toArray()
    .then((response) => {
      // here we will compare the password is valid or not

      bcrypt.compare(password, response[0].pass, function (err, result) {
        console.log(response, result);
        if (err) {
          res.send("something went wrong").status(400);
        } else {
          if (result) {
            res.send(response);
          } else {
            res.send("wrong crediantials");
          }
        }
      });

      // res.send(response);
    })
    .catch((err) => res.send(err).status(400));
});

app.get("/delete", (req, res) => {
  db.collection("users")
    .deleteMany({ name: "yakraj" })
    .then((response) => res.send(response))
    .catch((err) => res.send(err).status(400));
});

app.get("/crete", (req, res) => {
  db.collection("users")
    .find({ name: "yakraj" })
    .toArray()
    .then((response) => {
      if (!response.length) {
        db.collection("users")
          .insertOne({
            name: "yakraj",
            pass: "yakraj123",
            userid: "yakrajp123",
          })
          .then((response) => {
            res.json(response).status(200);
          })
          .catch((err) => res.send(err).status(400));
      } else {
        res.send("it already has data");
      }
    })
    .catch((err) => res.send(err).status(400));
});

app.get("/update", (req, res) => {
  const filter = { userid: "yakrajp123" };
  const update = { $set: { name: "james bond" } };

  db.collection("users")
    .updateOne(filter, update)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
