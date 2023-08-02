const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");
const cors = require("cors");
const bodyParser = require("body-parser");

const saltRounds = 10;

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
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  let collection = "users";
  db.collection(collection)
    .find({})
    .toArray()
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => res.send(err).status(400));
});
app.get("/getplans", (req, res) => {
  db.collection("plans")
    .find({})
    .toArray()
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => res.send(err).status(400));
});
app.get("/getsongs", (req, res) => {
  db.collection("songs")
    .find({})
    .toArray()
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => res.send(err).status(400));
});
app.post("/getsong", (req, res) => {
  const { songid } = req.body;
  db.collection("songs")
    .find({ songid: songid })
    .toArray()
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => res.send(err).status(400));
});
app.get("/getrecentplan", (req, res) => {
  db.collection("plans")
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .toArray()
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => res.send(err).status(400));
});

app.post("/songreco", (req, res) => {
  const { keyword } = req.body;
  db.collection("songs")
    .find({
      $or: [
        { title: new RegExp(`.*${keyword}.*`, "i") },
        { lyrics: new RegExp(`.*${keyword}.*`, "i") },
      ],
    })
    .toArray()
    .then((response) => res.send(response));
});

app.post("/plansearch", (req, res) => {
  const { keyword } = req.body;
  db.collection("plans")
    .find({
      $or: [
        { date: new RegExp(`.*${keyword}.*`, "i") },
        { planby: new RegExp(`.*${keyword}.*`, "i") },
      ],
    })
    .toArray()
    .then((response) => res.send(response));
});

app.post("/addplan", (req, res) => {
  const { plan } = req.body;
  plan.planid = uniqid(plan.date);
  db.collection("plans")
    .insertOne(plan)
    .then((response) => {
      res.send("new plan added");
    })
    .catch((err) => res.send(err).status(400));
});

app.post("/getcplan", (req, res) => {
  const { planid } = req.body;
  db.collection("plans")
    .find({ planid: planid })
    .toArray()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => res.send(err).status(400));
});

app.post("/addsongs", (req, res) => {
  const { songs } = req.body;
  let storedid = [];
  let updatedSongs = [];
  for (let i = 0; i < songs.length; i++) {
    const songid = uniqid(songs[i].title.substring(0, 5));
    let songdata = {};
    let tempsongs = songs[i];
    tempsongs.songid = songid;
    songdata.songind = songid;
    songdata.title = songs[i].title;
    updatedSongs = [...updatedSongs, tempsongs];
    storedid = [...storedid, songdata];
  }

  db.collection("songs")
    .insertMany(updatedSongs)
    .then((response) => {
      res.json(storedid).status(200);
    })
    .catch((err) => res.send(err).status(400));
});
app.post("/register", (req, res) => {
  const { name, phone, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      res.send("something went wrong").status(502);
    } else {
      const username = uniqid(name.substring(0, 3));
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
                db.collection("users")
                  .find({ phone: phone })
                  .toArray()
                  .then((userdata) => {
                    res.json(userdata);
                  });
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

app.post("/login", (req, res) => {
  const { phone, password } = req.body;
  db.collection("users")
    .find({ phone: phone })
    .toArray()
    .then((response) => {
      // here we will compare the password is valid or not
      bcrypt.compare(password, response[0].pass, function (err, result) {
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

// from here i'll integrate Mega

const port = 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
