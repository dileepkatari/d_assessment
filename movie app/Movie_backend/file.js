

var express = require('express')
var cors = require('cors');
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
const fs = require('fs');
var app = express();
// app.use(bodyparser());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors({
  orogin: 'http://localhost:8081',
}))
mongoose.connect('mongodb://localhost:27017/Mobileapps', function (err) {
  if (err) throw err;
  console.log("suceesfully connected");
});
var studentsSchema = mongoose.Schema({
  image: String,
  movieId: Number,
  title: String,
  description: String,
  rating: Number,
  languageIDs: String,
  genres: String,
  released: Number,
  fileName: String
});


var mydbmodel = mongoose.model('firstapps', studentsSchema);


var array = []
var coversdata = []
fs.readFile('covers.json', (err, data) => {
  if (err) throw err;
  coversdata = JSON.parse(data);
})






fs.readFile('movies.json', (err, data) => {
  if (err) throw err;
  let student = JSON.parse(data);
  student.rows.map(data => {
    Object.keys(data).map(key => {
      data[key].movies.map(mov => {
        coversdata.map(cov => {
          const obj = {}
          if (cov.movieID === String(mov.movieId)) {
            obj.fileName = cov.fileName
            obj.released = key
            obj.movieId = mov.movieId
            obj.title = mov.title
            obj.description = mov.description
            obj.rating = mov.rating
            let image = fs.readFileSync(`./images/${cov.fileName}`, { encoding: 'base64' })
            obj.image = `data:image/jpeg;base64,${image}`
            obj.languageIDs = mov.languageIDs[0]
            obj.genres = mov.genres[0]
            array.push(obj)

            //  console.log(array, obj, 'array')
          }

        })
      })
    })
  })
  mydbmodel.create(array)
});


app.post('/createmovies', function (req, res) {
  console.log(req.body, 'req.bodyreq.bodyreq.bodyreq.bodyreq.body');
  mydbmodel.create(req.body, (err, result) => {
    if (err) {
      res.send(err)
    }
    else {
      res.send({ result: result })


    }


  })
})




app.get('/getmovies', function (req, res) {
  console.log('inget')
  try{
    mydbmodel.find( {}, (err, result) => {
      // console.log(result, 'result')
      if (err) {
        console.log(err, 'err')
        res.send(err)
      }
      else {
        console.log('inelse')
        res.send(result)
      }
    })
  } catch(error){
    console.log(error)
  }

})

app.put('/:id', function (req, res) {
  mydbmodel.findByIdAndUpdate(req.params.id, req.body, {new:true, upsert:true}, (err, result) => {
    if (err) {
      res.send(err)
    }
    else {
      res.send(result)
    }
  })
})

app.listen(8080);











