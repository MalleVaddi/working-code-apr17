const mongoose = require('mongoose');

//define a schema/ blueprint NOTE: id is not a part of the schema 
const userSchema = new mongoose.Schema({
    firstName:  { type: String, required: true},
    lastName:  { type: String, required: true},
    email:      {type: String, required: true},
    password:   { type: String, required: true },
    phone:      { type: String, required: true },
    street:     { type: String},
    city:       { type: String },
    state:      { type: String },
    zip:        { type: String },
    bio:        { type: String },
    countries_visited: { type: String } // array of strings
    
});

//use the blueprint to create the model 
//Parameters: (model_name, schema_to_use, collection_name)
//module.exports is used to allow external access to the model  
module.exports = mongoose.model('User', userSchema,'users');
//note capital S in the collection name
