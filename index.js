const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
const app = express();

const MongoClient = require("mongodb").MongoClient;
require("dotenv").config()

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Root API
app.get("/", (req, res) => {
    res.send("Welcome to AR Cinema Hall");
  });
// MongoDB Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ydzqi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(() => {
  console.log("connected");
  // All collections
  const movieCollection = client
  .db(process.env.DB_NAME)
  .collection("moviesCollection");

  const seatsCollection = client
  .db(process.env.DB_NAME)
  .collection("seatsCollection");

  const bookingsCollection = client
  .db(process.env.DB_NAME)
  .collection("bookings");

  const testCollection = client
  .db(process.env.DB_NAME)
  .collection("test");

  //   collections end
  // ------------------------------------------------  

  //==================== All API =========================
  app.post("/movies", (req, res) => {
      const {date} = req.body;
      movieCollection.find({date})
        .toArray((err, movies) => {
            res.send(movies);
        })
  })
  app.get("/movie/:id", (req, res) => {
      const id = req.params.id;
      movieCollection.findOne({ _id: ObjectID(id) })
        .then(movie => res.send(movie));
  })
  app.get("/booking-info", (req, res) => {
        const {movieID, time} = req.query;
        bookingsCollection.findOne({movieID, time})
        .then(data => res.send(data || {bookedSeats: []}))
  })
  app.post("/confirm-booking", (req, res) => {
    const {movieID, time, bookedSeats, availableSeats} = req.body;
    if(availableSeats != 40){
        bookingsCollection.updateOne({ movieID, time }, {$set: {bookedSeats}})
        .then(result => res.send(result));
    } else{
        bookingsCollection.insertOne({movieID, time, bookedSeats})
        .then(result => res.send(result));
    }
  })

  // API End
});


  // Listening Request
const port = 4000;
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});