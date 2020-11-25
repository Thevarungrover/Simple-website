const express = require('express')
const app = express()
const Joi = require('joi')

app.use(express.json()) // converts any json input from the user into javascript code

// mock database in the form of array
const workshops = [
    {id : 1, name :'workshop1'},
    {id : 2, name :'workshop2'},
    {id : 3, name :'workshop3'},
]

// get  route
app.get('/' , (req,res) => {
    res.send('HELLO WORLD')
})

// get route to print whole array
app.get('/api/workshops', (req,res) => {
    res.send(workshops)
})

// get route to print different elements 
app.get('/api/workshops/1' , (req,res) => {
    res.send(workshops[0])
})
app.get('/api/workshops/2' , (req,res) => {
    res.send(workshops[1])
})
app.get('/api/workshops/3' , (req,res) => {
    res.send(workshops[2])
})

app.get('/api/workshops/:id' , (req,res) => {
   const workshop =  workshops.find(w => w.id === parseInt(req.params.id))
   if(!workshop) return res.status(404).send('Requested workshop not found')
   // printing the new array
    res.send(workshop)
})

// post route
// schema is used to describe the general structure of database
app.post('/api/workshops', (req,res) => {
    const schema ={  
      name : Joi.string().min(3).required()  // name with minimum 3 characters, is string and is required
    } 

    const result = Joi.validate(req.body, schema) //returns object
    if(result.error) return res.status(400).send(result.error.details[0].message)
    const workshop = {
        id : workshops.length + 1,
        name : req.body.name
    }
    workshops.push(workshop)
    // printing the new array
    res.send(workshops)
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