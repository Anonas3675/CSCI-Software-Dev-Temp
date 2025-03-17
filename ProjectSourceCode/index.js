// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'src/views/layouts'),
  partialsDir: path.join(__dirname, 'src/views/partials'),
  helpers: {
    json: function (context) {
      return JSON.stringify(context);
    }
  }
}); 

//app.set('views', path.join(__dirname, 'views'));


// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static('public'));


// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here


const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};


app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';

    try {
        await db.none(query, [username, hashedPassword]);
        res.redirect('/login');
    } catch (err) {
        console.error('Error registering user:', err);
        res.redirect('/register');
    }
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
        if (!user) {
            return res.render('pages/login', { message: 'Incorrect username or password.', error: true });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('pages/login', { message: 'Incorrect username or password.', error: true });
        }

        req.session.user = user;
        req.session.save();
        res.redirect('/home');
    } catch (err) {
        console.error('Login error:', err);
        res.render('pages/login', { message: 'Error logging in.', error: true });
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('pages/logout', { message: 'Logged out successfully.' });
    });
});


app.get('/game', auth, async (req, res) => {
    res.render('pages/game');
});

app.get('/home', (req, res) => {
  res.render('pages/home', {
      games: [
          { name: "Wordle", link: "/wordle" },
          { name: "GeoGuess", link: "/geoGuess" },
          { name: "Memory Match", link: "/memory" },
          { name: "Trivia", link: "/trivia" }
      ]
  });
});

app.get('/geoGuess', (req, res) => {
  const locations = [
      { name: "New York", file: "free hdr_map_811.jpg", lat: 40.7128, lon: -74.0060 },
      { name: "Tokyo", file: "free hdri_sky_816.jpg", lat: 35.6895, lon: 139.6917 },
      { name: "Paris", file: "hdri_sky_860.jpg", lat: 48.8566, lon: 2.3522 },
      { name: "London", file: "hdri_sky_864.jpg", lat: 51.5074, lon: -0.1278 }
  ];

  console.log("Locations being sent:", locations);


  res.render('pages/geoGuess', { locations });
});





// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');