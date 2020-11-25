const express = require('express')
const app = express()
const Joi = require('joi')
const mongoose = require('mongoose')

app.use(express.json()) // converts any json input from the user into javascript code

// connect database
mongoose.connect('mongodb://localhost:27018/my_captain_workshop', { useNewUrlParser: true }, { useUnifiedTopology: true })
    .then(() => console.log('connected to DB'))
    .catch(err => console.log(err))
 
// structure | scheme
const workshopSchema = new mongoose.Schema({
    name:{  // properties of name field
        type : String,
        required : true,
        minlength : 3
    }
})

// model the structure : create a class from schema
const Workshop = mongoose.model('Workshop',workshopSchema)

/* line 23 can be written as 
const Workshop = mongoose.model('Workshop',new mongoose.Schema({
    name:{  // properties of name field
        type : String,
        required : true,
        minlength : 3
    }
})
*/

// get  route
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

// post route
app.post('/api/workshops',async (req,res) => {
    const workshop =  new Workshop({
        name: req.body.name
    })
    await workshop.save()
    res.send(workshop)
})

// put route
app.put('/api/workshops/:id', (req,res) => {
    //  check if id is valid
    const workshop =  workshops.find(w => w.id === parseInt(req.params.id))
    if(!workshop) return res.status(400).send(result.error.details[0].message)

    // check if data is valid
    const schema ={  
        name : Joi.string().min(3).required()  // name with minimum 3 characters, is string and is required
      } 
  
      const result = Joi.validate(req.body, schema) //returns object
      if(result.error) return res.status(400).send(result.error.details[0].message)

    //  entering new name
      workshop.name = req.body.name

      // printing the new array
      res.send(workshops)
})

// delete route
app.delete('/api/workshops/:id' , (req,res) => {
    //  check if id is valid
    const workshop =  workshops.find(w => w.id === parseInt(req.params.id))
    if(!workshop) return res.status(404).send('Requested workshop not found')
// taking index of the object 
    const index = workshops.indexOf(workshop)
    // splicing the object
    workshops.splice(index,1)
    // printing the new array
    res.send(workshops)
})

// server
app.listen(5000, () =>{ 
    console.log('Server is running at port 5000....')
})