const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const Location = require('./models/location')
const User = require('./models/user')
const Post = require('./models/post');
const Login = require('./models/login')
const cors = require('cors');
app.use(cors());

/*mongoose.connect('mongodb://localhost:27017/RoamFreeBeyondMap')
    .then(() => { console.log("connected"); })
    .catch(() => { console.log("error connecting"); });
    */

    // MongoDB connection string
    mongoose.connect('mongodb+srv://roam-free-beyond-map:roam-free-beyond-map@roamfreebeyondmap.5z1x5p4.mongodb.net/?retryWrites=true&w=majority&appName=RoamFreeBeyondMap', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => { console.log("Connected to MongoDB"); })
    .catch(err => { console.error("Error connecting to MongoDB:", err); });

    
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

app.get('/locations/:id', (req, res) => {
  const { id } = req.params;

  // Optional: Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  Location.findById(id)
    .then(location => {
      if (!location) return res.status(404).json({ error: 'Location not found' });
      res.status(200).json(location);
    })
    .catch(err => res.status(500).json({ error: err.message }));
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

/*------------------- 📝 User Profile ROUTES ------------------- */
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
      password: req.body.password,
      phone: req.body.phone,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      bio: req.body.bio,
      
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

app.get('/user_profile/:id', (req, res, next) => {
  //call mongoose method findOne (MongoDB db.Students.findOne())
  User.findOne({_id: req.params.id}) 
      //if data is returned, send data as a response 
      .then(data => {
          res.status(200).json(data)
          console.log(data);
      })
      //if error, send internal server error
      .catch(err => {
      console.log('Error: ${err}');
      res.status(500).json(err);
  });
});

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
              password: req.body.password,
              phone: req.body.phone,
              street: req.body.street,
              city: req.body.city,
              state: req.body.state,
              zip: req.body.zip,
              bio: req.body.bio,
              
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await Login.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // If matched
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      userId: user._id
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/* ------------------- 📝 POST ROUTES ------------------- */

// Get all posts
app.get('/api/posts', (req, res) => {
  Post.find()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ error: 'Failed to retrieve posts', details: err.message }));
});

// Create a post
app.post('/api/posts', (req, res) => {
  const { title, content, author, tags } = req.body;

  const post = new Post({
    title,
    content,
    author,
    tags
  });

  post.save()
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(500).json({ error: 'Failed to create post', details: err.message }));
});

//Update a Post
app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, update, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post', details: err.message });
  }
});

//Delete a Post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params; // _id from MongoDB

  Post.findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: 'Posts deleted successfully' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Add a comment to a specific post
app.post('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (!post.comments) post.comments = [];
    post.comments.push({ text: text.trim() });

    await post.save();

    res.status(201).json({ message: 'Comment added successfully', post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment', details: err.message });
  }
});

// Get comments for a specific post
app.get('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const sortedComments = (post.comments || []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(sortedComments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments', details: err.message });
  }
});

app.put('/api/posts/:postId/comments/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.text = text;
    await post.save();

    res.json({ message: 'Comment updated', comment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment', details: err.message });
  }
});

app.delete('/api/posts/:postId/comments/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.id(commentId)?.remove();
    await post.save();

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment', details: err.message });
  }
});



//to use this middleware in other parts of the application
module.exports=app;
