var express = require('express')
var cors = require('cors');
var mongoose = require('mongoose')
var bodyparser = require('body-parser')
var app = express();
app.use(bodyparser());
app.use(cors({
    orogin: 'http://localhost:8085',
  }))
mongoose.connect('mongodb://localhost:27017/reactpractice',function(err){
 if(err) throw err;
 console.log("suceesfully connected");
});
var studentsSchema = mongoose.Schema({
    name:String,
    age:Number,
    gender:String,
    mobile:Number,
    city:String
});

var mydbmodel = mongoose.model('generaldata',studentsSchema);

app.post('/post' , function(req,res){
    mydbmodel.create(req.body, (err,result) => {
        if(err){
            res.send({
                error: true,
                message: 'Something went wrong'
            })
        }
        else{
            res.send({
                error:false,
                result:result
            })
        }
    })

})
app.get('/get',function(req,res){
    mydbmodel.find({},(err,result) =>{
        if(err){
            res.send(err)
        }
        else{
            res.send({result:result});
        }
    });
});

app.put('/edit/:id',function(req,res){
    mydbmodel.findByIdAndUpdate(req.params.id, req.body, {new:true, upsert:true},(err,result) =>{
        if(err){
            res.send(err)
        }
        else{
            res.send({result:result});
        }
    });
});

app.delete('/delete/:id', function(req,res){
    mydbmodel.findByIdAndRemove(req.params.id, (err,result) =>{
        if(err){
            res.send(err)
        }
        else{
            res.send({result:result});
        }
    });
});

app.listen(8085);
