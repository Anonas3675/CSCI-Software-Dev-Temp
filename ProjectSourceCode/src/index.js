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
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials'),
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

// // test your database
// db.connect()
//   .then(obj => {
//     console.log('Database connection successful'); // you can view this message in the docker compose logs
//     obj.done(); // success, release the connection;
//   })
//   .catch(error => {
//     console.log('ERROR:', error.message || error);
//   });

//ADDED TO SET UP 
const initializeDatabase = async () => {
  try {
    // Create the locations table if it doesn't exist
    await db.none(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_file VARCHAR(255) NOT NULL,
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL
      );
    `);
    console.log('Locations table created or already exists');
    
    // Check if data already exists to avoid duplicate inserts
    const count = await db.one('SELECT COUNT(*) FROM locations');
    if (parseInt(count.count) === 0) {
      // Insert data only if the table is empty
      await db.none(`
        INSERT INTO locations (name, image_file, latitude, longitude) VALUES 
        ('Folsom Statue', 'ArtBuilding.jpg', 40.01073, 105.26375),
        ('Business Field', 'BusinessField.jpg', 40.006120, 105.262480),
        ('Farrand Field', 'FarrandField.jpg', 40.00641, 105.26665),
        ('Art Building', 'ArtBuilding.jpg', 40.00712, 105.27027),
        ('Planetarium', 'Planetarium.jpg', 40.00354, 105.26397);
      `);
      console.log('Initial location data inserted');
    } else {
      console.log('Location data already exists, skipping insert');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

// Call the function when the app starts
db.connect()
  .then(obj => {
    console.log('Database connection successful');
    obj.done(); // success, release the connection
    
    // Initialize the database after connection is established
    initializeDatabase();
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
app.set('views', path.join(__dirname, '/views'));

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


app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await db.oneOrNone('SELECT * FROM User_Information WHERE username = $1', [username]);
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

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO User_Information (username, password) VALUES ($1, $2)';

    try {
        await db.none(query, [username, hashedPassword]);
        res.redirect('/login');
    } catch (err) {
        console.error('Error registering user:', err);
        res.redirect('/register');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('pages/logout', { message: 'Logged out successfully.' });
    });
});





const auth = (req, res, next) => {
  if (!req.session.user) {
      return res.redirect('/login');
  }
  next();
};

app.use(auth)



app.get('/home', auth, async (req, res) => {
  res.render('pages/home', {
      games: [
          { name: "Wordle", link: "/wordle" },
          { name: "GeoGuess", link: "/geoGuess" },
          { name: "Crossword", link: "/crossword" },
          { name: "Trivia", link: "/trivia" }
      ]
  });
});

app.get('/geoGuess', async (req, res) => {
  try {
    const locations = await db.any('SELECT name, image_file AS file, latitude AS lat, longitude AS lon FROM locations');
    res.render('pages/geoGuess', { locations });
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).send("Database error: " + err.message);
  }
});

app.post('/save-location', async (req, res) => {
    const { lat, lon } = req.body;
  
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'Missing coordinates' });
    }
  
    try {
      await db.none(
        'INSERT INTO locations (name, image_file, latitude, longitude) VALUES ($1, $2, $3, $4)',
        ['User Guess', 'placeholder.jpg', lat, lon]
      );
      res.json({ success: true, message: 'Location saved!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

app.get('/check-locations', async (req, res) => {
  try {
    const locations = await db.any('SELECT * FROM locations');
    res.json(locations);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});





// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');
