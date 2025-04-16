const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const Location = require('./models/location')
const User = require('./models/user')
const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb://localhost:27017/RoamFreeBeyondMap')
    .then(() => { console.log("connected"); })
    .catch(() => { console.log("error connecting"); });

    
app.use((req, res, next) => {
    console.log('This line is always called');
    res.setHeader('Access-Control-Allow-Origin', '*'); //can connect from any host
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); //allowable methods
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())

//in the app.get() method below we add a path for the students API 
//by adding /locations, we tell the server that this method will be called every time http://localhost:8000/locations is requested. 
app.get('/locations', (req, res, next) => {
    //we will add an array named students to pretend that we received this data from the database
//call mongoose method find (MongoDB db.Locations.find())
Location.find() 
    //if data is returned, send data as a response 
    .then(data => res.status(200).json(data))
    //if error, send internal server error
    .catch(err => {
    console.log('Error: ${err}');
    res.status(500).json(err);
});

});

app.post('/locations', (req, res, next) => {
  console.log("📥 Incoming request body:", req.body); // <-- Add this line

  const formValues = req.body;

  const location = new Location({
    name: formValues.name?.trim() || '',
    location: {
      city: formValues.location?.city?.trim() || '',
      country: formValues.location?.country?.trim() || '',
    },
    coordinates: {
      lat: formValues.coordinates?.lat,
      lng: formValues.coordinates?.lng,
    },
    description: formValues.description?.trim() || 'No description provided',
    category: formValues.category?.trim() || '',
    rating: formValues.rating ?? 0,
  });

  location.save()
    .then(() => {
      console.log('✅ Location saved!');
      res.status(201).json({ message: 'Location added successfully' });
    })
    .catch(err => {
      console.error('❌ Error saving location:', err.message);
      res.status(500).json({ error: 'Failed to add location', details: err.message });
    });
});

app.put('/locations/:id', (req, res) => {
  const { id } = req.params; // _id from MongoDB
  const { name, location, coordinates, description, category, rating } = req.body;

  Location.findByIdAndUpdate(id, { name, location, coordinates, description, category, rating }, { new: true })
    .then(updatedLocation => res.json(updatedLocation))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/locations/:id', (req, res) => {
  const { id } = req.params; // _id from MongoDB

  Location.findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: 'Location deleted successfully' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/user_profile', (req, res, next) => {
  //we will add an array named students to pretend that we received this data from the database
      //call mongoose method find (MongoDB db.Students.find())
  User.find() 
  //if data is returned, send data as a response 
      .then(data => res.status(200).json(data))
  //if error, send internal server error
      .catch(err => {
      console.log('Error: ${err}');
      res.status(500).json(err);
});

});
//serve incoming post requests to /students
app.post('/user_profile', (req, res, next) => {
  const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      bio: req.body.bio,
      profileImage: req.body.profileImage,
      countries_visited: req.body.countries_visited
          
  });
  
  // Save the user document to the database
      user.save()
      // If successful
          .then(() => { console.log('successful'); })
      // If there is an error
          .catch(err => { console.log('Error: ' + err); });
  
  
}

);
app.delete("/user_profile/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json("Deleted!");
  });
});

      
//serve incoming put requests to /students 
app.put('/user_profile/:id', (req, res, next) => { 
  console.log("id: " + req.params.id) 
  // check that the parameter id is valid 
  if (mongoose.Types.ObjectId.isValid(req.params.id)) { 
      //find a document and set new first and last names 
      User.findOneAndUpdate( 
          {_id: req.params.id}, 
          {$set:{ 
              firstName : req.body.firstName, 
              lastName : req.body.lastName ,
              email: req.body.email,
              email: req.body.email,
              phone: req.body.phone,
              street: req.body.street,
              city: req.body.city,
              state: req.body.state,
              zip: req.body.zip,
              bio: req.body.bio,
              profileImage: req.body.profileImage,
              countries_visited: req.body.countries_visited
          }}, 
          {new:true} 
      ) 
      .then((user) => { 
          if (user) { //what was updated 
              console.log(user); 
          } else { 
              console.log("no data exist for this id"); 
          } 
      }) 
      .catch((err) => { 
          console.log(err); 
      }); 
  } else { 
      console.log("please provide correct id"); 
  } 
});


//to use this middleware in other parts of the application
module.exports=app;