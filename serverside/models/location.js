
const mongoose = require('mongoose');

//define a schema/ blueprint NOTE: id is not a part of the schema 
const locationSchema = new mongoose.Schema({
    name: String,
    location: {
      city: String,
      country: String,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    description: String,
    category: String,
    rating: Number,
  });

//use the blueprint to create the model 
//Parameters: (model_name, schema_to_use, collection_name)
//module.exports is used to allow external access to the model  
module.exports = mongoose.model('Location', locationSchema,'Locations');
//note capital S in the collection name