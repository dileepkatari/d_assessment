var express = require('express')
var cors = require('cors');
var mongoose = require('mongoose')
var bodyparser = require('body-parser')
const fs = require('fs');
var app = express();
app.use(bodyparser());
app.use(cors({
  orogin: 'http://localhost:8081',
}))
mongoose.connect('mongodb://localhost:27017/Mobileapps', function (err) {
  if (err) throw err;
  console.log("suceesfully connected");
});
var studentsSchema = mongoose.Schema({
  movieId: Number,
  title: String,
  description: String,
  rating: Number,
  languageIDs: String,
  genres: String,
  released: Number
});


var mydbmodel = mongoose.model('firstapps', studentsSchema);

var covermodel = mongoose.model('covers', coversSchema)

const array = []

fs.readFile('covers.json', (err, data) => {
  if (err) throw err;
  let covers = JSON.parse(data);
  // console.log(covers, 'covers')
  covermodel.create(covers)
})

fs.readFile('movies.json', (err, data) => {
  if (err) throw err;
  let student = JSON.parse(data);
  student.rows.map(data => {
    Object.keys(data).map(key => {
        data[key].movies.map(mov => {
          const obj = {}
          obj.released = key
          obj.movieId = mov.movieId
          obj.title = mov.title
          obj.description = mov.description
          obj.rating = mov.rating
          obj.languageIDs = mov.languageIDs[0]
          obj.genres = mov.genres[0]
          array.push(obj)
        })
    })
  })
  mydbmodel.create(array)
  // console.log(array, 'array')
});


app.post('/createmovies', function (req, res) {
  mydbmodel.create(req.body, (err, result) => {
    if (err) {
      res.send(err)
    }
    else {
      res.send({ result: result })
    }

  })
})

app.get('/getcovers',  function(req,res){
  covermodel.find({}, (err,result) => {
    if(err){
      res.send(err)
    }
    else{
      res.send(result)
    }
  })
})

app.get('/getmovies',  function(req,res){
  mydbmodel.find({}, (err,result) => {
    if(err){
      res.send(err)
    }
    else{
      res.send(result)
    }
  })
})

app.listen(8080);
