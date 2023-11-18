const express = require("express");
  morgan = require('morgan');

  const app = express();

  const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

  app.use(morgan('common'));

let topMovies = [
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling'
  },
  {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien'
  },
  {
    title: 'Twilight',
    author: 'Stephanie Meyer'
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling'
  },
  {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien'
  },
  {
    title: 'Twilight',
    author: 'Stephanie Meyer'
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling'
  },
  {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien'
  },
  {
    title: 'Twilight',
    author: 'Stephanie Meyer'
  },
  {
    title: 'Twilight',
    author: 'Stephanie Meyer'
  }
];

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

app.get('/movies', (req, res) => {
  res.json(topMovies);
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});