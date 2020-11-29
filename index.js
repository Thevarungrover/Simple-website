const express = require('express')
const app = express()
const Joi = require('joi')
const mongoose = require('mongoose') // for database

app.use(express.json()) // converts any json input from the user into javascript code

// connect database - MongoDB
mongoose.connect('mongodb://localhost:27018/my_captain_workshop', { useNewUrlParser: true }, { useUnifiedTopology: true })
    .then(() => console.log('connected to DB'))
    .catch(err => console.log(err))
 

// structure | schema
const workshopSchema = new mongoose.Schema({
    name:{  // properties of name field
        type : String,
        required : true,
        minlength : 3
    }
})

// model the structure : create a class from schema
const Workshop = mongoose.model('Workshop',workshopSchema)

/* line 25 can be written as 
const Workshop = mongoose.model('Workshop',new mongoose.Schema({
    name:{  // properties of name field
        type : String,
        required : true,
        minlength : 3
    }
})
*/

// get  route - print data 
app.get('/' , (req,res) => {
    res.send('HELLO WORLD')
})

// get route to print whole array
app.get('/api/workshops',async (req,res) => {
   const workshops = await Workshop.find()
   res.send(workshops)
})

// get route to print different elements 

/*
app.get('/api/workshops/1' , (req,res) => {
    res.send(workshops[0])
})
app.get('/api/workshops/2' , (req,res) => {
    res.send(workshops[1])
})
app.get('/api/workshops/3' , (req,res) => {
    res.send(workshops[2])
})
*/

app.get('/api/workshops/:id' , async(req,res) => {
   const workshop = await Workshop.findById(req.params.id)
   if(!workshop) return res.status(404).send('Requested workshop not found')
   // printing the new array
    res.send(workshop)
})

// post route - add new
app.post('/api/workshops',async (req,res) => {
    const workshop =  new Workshop({
        name: req.body.name
    })
    await workshop.save()
    res.send(workshop)
})

// put route - update
app.put('/api/workshops/:id', (req,res) => {
     Workshop.findByIdAndUpdate(req.params.id,req.body).exec(function(err,result){
         Workshop.findById(req.params.id).exec(function(err,result){
            res.status(200).json(result)
         })
     })
})

// delete route -delete
app.delete('/api/workshops/:id' , (req,res) => {
    Workshop.deleteOne({_id:req.params.id})
    .then(
        () => {
            res.status(200).json(
                {
                    message:'DELETED'
                }
            )
        }
    )
    .catch((error) => {
        res.status(400).json(
            {
                error:error
            }
        )
    })
})

// server
app.listen(5000, () =>{ 
    console.log('Server is running at port 5000....')
})