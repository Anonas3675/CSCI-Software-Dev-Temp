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
      res.status(200);
      res.redirect('/home');
  } catch (err) {
      console.error('Login error:', err);
      res.status(400);
      res.render('pages/login', { message: 'Error logging in', error: true });
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
      res.status(200);
      res.redirect('/login');
    } catch (err) {
        res.status(400);
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
          { name: 'Wordle', link: '/wordle' },
          { name: 'GeoGuess', link: '/geoGuess' },
          { name: 'Crossword', link: '/crossword' },
          { name: 'Trivia', link: '/trivia' }
      ]
  });
});

app.get('/scoreboard', auth, async (req, res) => {
  const type = req.query.type || 'geoguessr';

  const leaderboardResults = {
    geoguessr: {
      query: 'SELECT username, highscore AS score FROM Geoguessr_Leaderboard ORDER BY highscore DESC',
      title: 'Geoguessr Leaderboard',
    },
    wordle: {
      query: 'SELECT username, highest_streak AS score FROM Wordle_Leaderboard ORDER BY highest_streak DESC',
      title: 'Wordle Leaderboard',
    },
    trivia: {
      query: 'SELECT username, highest_streak AS score FROM Trivia_Leaderboard ORDER BY highest_streak DESC',
      title: 'Trivia Leaderboard',
    },
    crossword: {
      query: 'SELECT username, highest_streak AS score FROM Crossword_Leaderboard ORDER BY highest_streak DESC',
      title: 'Crossword Leaderboard',
    },
  };

  const leaderboard = leaderboardResults[type];
  try {
    //const [results] = await db.any(leaderboard.query);
    const results = await db.any(leaderboard.query);
    res.render('pages/scoreboard', { leaderboard: results, title: leaderboard.title, type });
  } catch (err) {
    console.error(`Error fetching ${type} leaderboard`, err);
    res.status(500).send(`Leaderboard error: ${err.message}`);
  }
});   

app.get('/geoGuess', async (req, res) => {
  console.log('getting geoguess')
  try {
    const locations = await db.any('SELECT name, image_file AS file, latitude AS lat, longitude AS lon FROM locations');
    console.log(locations)
    res.render('pages/geoGuess', { locations });
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).send('Database error: ' + err.message);
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

app.get('/welcome', (req, res) => {
  res.json({status: success, message: 'Welcome!'});
});

// Trivia APIs
app.get('/trivia', (req, res) => {
  res.render('pages/trivia');
})

//Wordel APIs
app.get('/wordle', (req, res) => {
  res.render('pages/wordle');
})

app.get('/question', async (req, res) => {
  const difficulty = req.query.difficulty;
  try {
    const question = await db.one('SELECT question, question_id FROM Trivia_Question_Bank WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 1;', [difficulty])
    res.json({question: question, question_id: question_id});
  } catch (err) {
    console.error('Error selecting question:', err);
    res.status(500).json({error: err.message});
  }
});

//API's for Crossword

// Get all puzzles
app.get('/puzzles', async (req, res) => {
  try {
    const puzzles = await db.any('SELECT * FROM crossword_puzzles');
    res.json(puzzles);
  } catch (err) {
    console.error('Error fetching puzzles:', err);
    res.status(500).json({ error: 'Error fetching puzzles' });
  }
});


// Get a specific puzzle by ID
app.get('/puzzles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const puzzle = await db.oneOrNone('SELECT * FROM crossword_puzzles WHERE puzzle_id = $1', [id]);

    if (!puzzle) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    res.json(puzzle);
  } catch (err) {
    console.error('Error fetching puzzle:', err);
    res.status(500).json({ error: 'Error fetching puzzle' });
  }
});

// Get the grid structure for a puzzle
app.get('/grid/:puzzle_id', async (req, res) => {
  const { puzzle_id } = req.params;

  try {
    const grid = await db.any('SELECT * FROM crossword_grid WHERE puzzle_id = $1 ORDER BY row_index, col_index', [puzzle_id]);
    res.json(grid);
  } catch (err) {
    console.error('Error fetching grid:', err);
    res.status(500).json({ error: 'Error fetching grid' });
  }
});

// Get the clues for a puzzle
app.get('/clues/:puzzle_id', async (req, res) => {
  const { puzzle_id } = req.params;

  try {
    const clues = await db.any('SELECT * FROM crossword_clues WHERE puzzle_id = $1 ORDER BY clue_number', [puzzle_id]);
    res.json(clues);
  } catch (err) {
    console.error('Error fetching clues:', err);
    res.status(500).json({ error: 'Error fetching clues' });
  }
});

//Update the user win when a crossword is successfully completed
app.post('/update-streak', auth, async (req, res) => {
  try {
    // Get user ID from session
    const userId = req.session.user.user_id;
    
    const userWithStreak = await db.oneOrNone(`
      SELECT ui.user_id, ui.username, cl.highest_streak
      FROM User_Information ui
      LEFT JOIN Crossword_Leaderboard cl ON ui.user_id = cl.user_id
      WHERE ui.user_id = $1`, [userId]);
    
    if (!userWithStreak) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if streak exists in leaderboard
    if (userWithStreak.highest_streak === null) {
      // First-time streak, insert into leaderboard with streak = 1
      const insertQuery = `
        INSERT INTO Crossword_Leaderboard (user_id, username, highest_streak)
        VALUES ($1, $2, 1)
        RETURNING highest_streak`;
      const result = await db.one(insertQuery, [userId, userWithStreak.username]);
    
      return res.json({ 
        success: true, 
        message: 'First streak recorded', 
        newStreak: result.highest_streak,
        username: userWithStreak.username
      });
    } 
    
    else {
      // Update existing streak
      const updateQuery = `
        UPDATE Crossword_Leaderboard 
        SET highest_streak = highest_streak + 1 
        WHERE user_id = $1 
        RETURNING highest_streak`;
      const result = await db.one(updateQuery, [userId]);
    
      return res.json({ 
        success: true, 
        message: 'Streak Updated', 
        newStreak: result.highest_streak,
        username: userWithStreak.username
      });
    }
  } 
  
  catch (err) {
    console.error('Error updating crossword streak:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Database error: ' + err.message 
    });
  }
});

app.get('/crossword', (req, res) => {
  res.render('pages/crossword');
});



// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
