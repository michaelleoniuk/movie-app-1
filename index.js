const express = require('express');
  app = express();
  bodyParser = require('body-parser');
  uuid = require('uuid');

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Mike",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Monika",
    favoriteMovies: ["Secondmovie"]
  },
]

let movies = [
  
  {
    "Title":"Firstmovie",
    "Description":"Description of The First",
    "Genre": {
      "Name":"Drama",
      "Description":"Description of drama movie"
    },
    "Director": {
      "Name":"Mike Angelo",
      "Bio":"Mike is a director",
      "Birth":1969.0
    },
    "imageURL":"",
    "Featured":false
  },

  {
    "Title":"Secondmovie",
    "Description":"Description of The Second",
    "Genre": {
      "Name":"Comedy",
      "Description":"Description of comedy movie"
    },
    "Director": {
      "Name":"Mona Lisa",
      "Bio":"Mona is a director",
      "Birth":1972.0
    },
    "imageURL":"",
    "Featured":false
  }

];

//Return a list of ALL movies to the user 

//(READ)

app.get('/movies', (req, res) => {
  res.status(200).json(movies);
})

//Return data (description, genre, director, image URL, whether it is featured or not) about a single movie by title to the user

//(READ)

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
  res.status(200).json(movie);
  } else {
  res.status(400).send('movie not found')
  };

})

//Return data about a genre (description) by name/title (e.g., “Thriller”)

//(READ)

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
  res.status(200).json(genre);
  } else {
  res.status(400).send('movie not found')
  };

})

//Return data about a director (bio, birth year, death year) by name

//(READ)

app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
  res.status(200).json(director);
  } else {
  res.status(400).send('no director found')
  };

})

//Allow new users to register

//CREATE

app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).json(newUser)
  } else {
      res.status(400).send('users need name')
  }
})

//Allow users to update their user info (username)

//UPDATE

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no user found')
  }

})

//Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)

//CREATE

app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no user found')
  }

})

//Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)

//DELETE

app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no user found')
  }

})



//Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)

//DELETE

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send('no user found')
  }

})

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(myLogger);
app.use(requestTime);

app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  let responseText = 'Welcome to myFlix';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});



app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});