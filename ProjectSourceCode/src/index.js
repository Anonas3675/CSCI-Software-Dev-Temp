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

// Call the function when the app starts
db.connect()
  .then(obj => {
    console.log('Database connection successful');
    obj.done(); // success, release the connection
    
    // Initialize the database after connection is established

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
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
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
    try {
      const query = 'INSERT INTO User_Information (username, user_id, password) VALUES ($1, $2, $3)';

      const user_serial = await db.one('INSERT INTO User_To_Backend DEFAULT VALUES RETURNING user_id');
      const user_id = user_serial.user_id;

      await db.none(query, [username, user_id, hashedPassword]);
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
  console.log("getting geoguess")
  try {
    const locations = await db.any('SELECT name, image_file AS file, latitude AS lat, longitude AS lon FROM locations');
    console.log(locations)
    res.render('pages/geoGuess', { locations });
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).send("Database error: " + err.message);
  }
});

app.post('/save-location', async (req, res) => {
  const { totalDistance } = req.body;
  const { user_id, username } = req.session.user;

  if (!user_id || !totalDistance) {
    return res.status(400).json({ success: false, message: 'Missing session or score data' });
  }

  // Convert distance into a score (e.g., inverse or subtract from max)
  const maxScore = 30000; // 10,000 pts per round
  const score = Math.max(0, Math.round(maxScore - totalDistance * 1000)); // subtract meters

  try {
    await db.none(`
      INSERT INTO User_Geoguessr_Stats (user_id, highest_score)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET highest_score = GREATEST(User_Geoguessr_Stats.highest_score, EXCLUDED.highest_score)
    `, [user_id, score]);

    await db.none(`
      INSERT INTO Geoguessr_Leaderboard (user_id, username, highscore)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET highscore = GREATEST(Geoguessr_Leaderboard.highscore, EXCLUDED.highscore)
    `, [user_id, username, score]);

    res.json({ success: true, message: 'Score recorded!', score });
  } catch (err) {
    console.error('Error saving GeoGuessr score:', err);
    res.status(500).json({ success: false, message: 'Server error' });
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
