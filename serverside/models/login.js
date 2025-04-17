const mongoose = require('mongoose');

// define a schema for login
const loginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// export the model
module.exports = mongoose.model('Login', loginSchema, 'logins');
