const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
const pdf = require('html-pdf');
const pdfTemplate = require('./documents');
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

//   test
  const User = client
  .db(process.env.DB_NAME)
  .collection("User");
  
  const Employee = client
  .db(process.env.DB_NAME)
  .collection("Employee");

  //   collections end
  // ------------------------------------------------  
 
  //==================== All API =========================
  app.post("/movies", (req, res) => {
      const {date} = req.body;
      const day = date.split(" ")[0];
      movieCollection.find({date: day})
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
        const {movieID, showDate, time} = req.query;
        bookingsCollection.findOne({movieID, showDate, time})
        .then(data => res.send(data || {bookedSeats: []}))
  })
  app.post("/confirm-booking", (req, res) => {
    const {movieID, showDate, time, bookedSeats, availableSeats} = req.body;
    if(availableSeats != 40){
        bookingsCollection.updateOne({ movieID, showDate, time }, {$set: {bookedSeats}})
        .then(result => {
          res.send("Updated");
        });
    } else{
        bookingsCollection.insertOne({movieID, showDate, time, bookedSeats})
        .then(result => {
          res.send("created");
        });
    }
  })

  app.post("/get-pdf", (req, res) => {
    const {movieTitle, email, showDate, time, selectedSeats} = req.body;
      pdf.create(pdfTemplate(email, movieTitle, showDate, time, selectedSeats), {}).toFile('result.pdf', (err) => {
        res.sendFile(`${__dirname}/result.pdf`);
      });
  })
  

  // API End
});
app.get('/download-pdf', (req, res) =>{
  pdf.create(pdfTemplate(), {}).toFile('result.pdf', (err) => {
      res.sendFile(`${__dirname}/result.pdf`);
  });
})

  // Listening Request
const port = 4000;
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});