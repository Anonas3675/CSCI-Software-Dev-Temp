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
const fs = require('fs'); //Dylan added this, used for reading out possible wordle guesses

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
    },
    add: function(value1, value2) {  //helper functions so the scoreboard starts at 1 instead of 0
      return value1 + value2;
    }
  }
}); 

//app.set('views', path.join(__dirname, 'views'));


// database configuration
const dbConfig = {
  host: process.env.POSTGRES_HOST, // the database server
  port: process.env.POSTGRES_PORT, // the database port
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

app.use(express.static('src/resources'));


// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here




app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  else {
    res.redirect('/home');
  }
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
        res.status(400);
        return res.render('pages/login', { message: 'Incorrect username or password.', error: true });
      }

      req.session.user = {
        user_id: user.user_id,
        username: user.username,
      };
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
      //Need to make a request to the database before adding a user :)
      const existingUserQuery = 'SELECT 1 FROM User_Information WHERE username = $1 LIMIT 1';
      const result = await db.query(existingUserQuery, [username]);
      console.log('This is the response of the query:');
      console.log(result);
      if (result.length > 0) {
        console.log('Username Already Exists');
        return res.render('pages/register', {message: 'Username already in use, please select a different username', error: true});
      }

      const query = 'INSERT INTO User_Information (username, user_id, password) VALUES ($1, $2, $3)';

      const user_serial = await db.one('INSERT INTO User_To_Backend DEFAULT VALUES RETURNING user_id');
      const user_id = user_serial.user_id;

      await db.none(query, [username, user_id, hashedPassword]);
      res.status(200);
      res.redirect('pages/login');
    } catch (err) {
        res.status(400);
        console.error('Error registering user:', err);
        res.redirect('pages/register');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('pages/logout', { message: 'Logged out successfully!' });
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
  console.log(req.session);
  res.render('pages/home', {
      user: req.session.user,
      games: [
          { name: 'Wordle', link: '/wordle' },
          { name: 'GeoGuess', link: '/geoGuess' },
          { name: 'Crossword', link: '/crossword' },
          { name: 'Trivia', link: '/trivia' }
      ]
  });
  console.log(req.session.user);
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
    res.render('pages/scoreboard', { leaderboard: results, title: leaderboard.title, type, user: req.session.user });
  } catch (err) {
    console.error(`Error fetching ${type} leaderboard`, err);
    res.status(500).send(`Leaderboard error: ${err.message}`);
  }
});   

app.get('/geoGuess', async (req, res) => {
  console.log('getting geoguess')
  try {
    const location = await db.any('SELECT name, image_file AS file, latitude AS lat, longitude AS lon FROM Geo_Guessr_Location');
    console.log(location)
    res.render('pages/geoGuess', { location, user: req.session.user });
    } catch (err) {
    console.error('Error fetching location:', err);
    res.status(500).send('Database error: ' + err.message);
  }
});

app.post('/saveScore', async (req, res) => {
  const { totalDistance } = req.body;

  if (typeof totalDistance === 'undefined') {
    return res.status(400).json({ success: false, message: 'Missing score' });
  }

  // Convert distance to "score" (e.g., lower is better, so maybe reverse it)

  const newScore = Math.round(1000 - parseFloat(totalDistance) * 600); // Example scoring logic

  const userId = req.session.user.user_id;
  const username = req.session.user.username;
  try {
    // Check if user already has a score
    const existing = await db.oneOrNone(
      'SELECT highscore FROM Geoguessr_Leaderboard WHERE user_id = $1',
      [userId]
    );

    if (!existing) {
      // New user entry
      await db.none(
        'INSERT INTO Geoguessr_Leaderboard (user_id, username, highscore) VALUES ($1, $2, $3)',
        [userId, username, newScore]
      );
    } else if (newScore > existing.highscore) {
      // Only update if new score is better
      await db.none(
        'UPDATE Geoguessr_Leaderboard SET highscore = $1 WHERE user_id = $2',
        [newScore, userId]
      );
    }

    res.json({ success: true, message: 'Score saved to leaderboard' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
}); 

app.get('/check-locations', async (req, res) => {
  try {
    const location = await db.any('SELECT * FROM Geo_Guessr_Location');
    res.json(location);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Trivia APIs
app.get('/trivia', (req, res) => {
  res.render('pages/trivia', {user: req.session.user});
})

app.get('/question', async (req, res) => {
  const difficulty = parseInt(req.query.difficulty) || 2;

  try {
    const question = await db.one(
      `SELECT question_id, question, correct_answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3
       FROM Trivia_Question_Bank
       WHERE difficulty = $1
       ORDER BY RANDOM() LIMIT 1`,
      [difficulty]
    );
    res.json({ question });
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).json({ error: 'Failed to fetch trivia question.' });
  }
});

app.post('/submit-trivia-answer', auth, async (req, res) => {
  const userId = req.session.user.user_id;
  const { correct } = req.body;

  try {
    const stats = await db.oneOrNone(
      `SELECT current_streak, highest_streak FROM User_Trivia_Stats WHERE user_id = $1`,
      [userId]
    );

    if (!stats) {
      await db.none(
        `INSERT INTO User_Trivia_Stats (user_id, current_streak, highest_streak) VALUES ($1, $2, $2)`,
        [userId, correct ? 1 : 0]
      );
    } else {
      const newStreak = correct ? stats.current_streak + 1 : 0;
      const newHighest = Math.max(stats.highest_streak, newStreak);

      await db.none(
        `UPDATE User_Trivia_Stats
         SET current_streak = $1, highest_streak = $2
         WHERE user_id = $3`,
        [newStreak, newHighest, userId]
      );
    }

    // Leaderboard update
    const lb = await db.oneOrNone(
      `SELECT highest_streak FROM Trivia_Leaderboard WHERE user_id = $1`,
      [userId]
    );

    if (!lb && correct) {
      await db.none(
        `INSERT INTO Trivia_Leaderboard (user_id, username, highest_streak)
         VALUES ($1, $2, 1)`,
        [userId, req.session.user.username]
      );
    } else if (lb && correct && stats.current_streak + 1 > lb.highest_streak) {
      await db.none(
        `UPDATE Trivia_Leaderboard SET highest_streak = $1 WHERE user_id = $2`,
        [stats.current_streak + 1, userId]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error submitting answer:', err);
    res.status(500).json({ success: false, error: 'Failed to submit answer.' });
  }
});


//Wordle APIs

//This renders the wordle page 
app.get('/wordle', (req, res) => {
  res.render('pages/wordle', {user: req.session.user});
})


app.post('/update-wordle-stats', auth, async (req, res) => {
  const { won } = req.body;
  const userId = req.session.user.user_id;
  const username = req.session.user.username;

  try {
    // Check if the user already has stats
    const stats = await db.oneOrNone(
      'SELECT * FROM User_Wordle_Stats WHERE user_id = $1',
      [userId]
    );

    if (!stats) {
      // New user, insert default values
      await db.none(
        `INSERT INTO User_Wordle_Stats (user_id, successful_attempts, games_played, win_streak, highest_win_streak)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, won ? 1 : 0, 1, won ? 1 : 0, won ? 1 : 0]
      );
    } else {
      const newGamesPlayed = stats.games_played + 1;
      const newSuccessfulAttempts = stats.successful_attempts + (won ? 1 : 0);
      const newWinStreak = won ? stats.win_streak + 1 : 0;
      const newHighestStreak = Math.max(stats.highest_win_streak, newWinStreak);

      await db.none(
        `UPDATE User_Wordle_Stats
         SET successful_attempts = $1,
             games_played = $2,
             win_streak = $3,
             highest_win_streak = $4
         WHERE user_id = $5`,
        [newSuccessfulAttempts, newGamesPlayed, newWinStreak, newHighestStreak, userId]
      );
    }

    // Update leaderboard
    const leaderboard = await db.oneOrNone(
      'SELECT * FROM Wordle_Leaderboard WHERE user_id = $1',
      [userId]
    );

    if (!leaderboard && won) {
      await db.none(
        `INSERT INTO Wordle_Leaderboard (user_id, username, highest_streak)
         VALUES ($1, $2, 1)`,
        [userId, username]
      );
    } else if (won && stats && stats.win_streak + 1 > leaderboard.highest_streak) {
      await db.none(
        `UPDATE Wordle_Leaderboard
         SET highest_streak = $1
         WHERE user_id = $2`,
        [stats.win_streak + 1, userId]
      );
    }

    res.json({ success: true, message: 'Wordle stats updated' });
  } catch (err) {
    console.error('Error updating Wordle stats:', err);
    res.status(500).json({ success: false, message: 'Error updating stats' });
  }
});





//Whenever a guess gets made, make a call to this. This should store the guess in the server
app.post('/saveguess', (req, res) => {
  const guess = req.body.guess;

  // Initialize guesses array if needed
  if (!req.session.guesses) {
    req.session.guesses = [];
  }

  req.session.guesses.push(guess);
  req.session.save();
  //After a request is made to save a guess, it returns all of the saved guesses
  res.json({ message: "Guess saved", guesses: req.session.guesses });
});

//Still need a wordle API that will handle loading perviously made guesses
app.get('/getguess', (req, res) => {
  const previousGuesses = req.session.guesses || [];
  res.json(previousGuesses);
});

//This reads out the json file and stores its contents in wordlist
const wordlist = JSON.parse(fs.readFileSync('src/resources/json/wordle-allowed-guesses2.json', 'utf-8'));

//Wordle API for checking a guess
app.post('/checkguess', async (req, res) => {
  const guess = req.body.guess;
  if(!guess){
    return res.status(400).json({ error: 'No word provided' });
  }
  try{
    //const apiResponse = await fetch(`https://api.datamuse.com/words?sp=${guess}&max=1`); //Make a request to the api
    //const data = await apiResponse.json(); //get a response
    //const isValid = (data.length > 0) && (data[0].word.toLowerCase() === guess.toLowerCase());
    const isValid2 = wordlist.includes(guess.toLowerCase());
    res.json({valid: isValid2});
  } catch(err) {
    res.status(500).json({ error: 'Something went wrong' });
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

app.get('/has-completed', auth, async (req, res) => {
  const userId = req.session.user.user_id;
  const puzzleId = parseInt(req.query.puzzleId, 10);

  if (!puzzleId) {
    return res.status(400).json({ success: false, message: 'Puzzle ID is required' });
  }

  try {
    // Check if there's an entry for this user and puzzle
    const result = await db.oneOrNone(`
      SELECT completed 
      FROM User_Crossword_Stats 
      WHERE user_id = $1 AND puzzle_id = $2
    `, [userId, puzzleId]);

    // If no result is found, the user hasn't completed this puzzle
    if (!result) {
      return res.json({ success: true, completed: false });
    }

    // Otherwise return the completion status
    return res.json({ success: true, completed: result.completed });

  } catch (err) {
    console.error('Error checking completion status:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.post('/mark-completed', auth, async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const { puzzleId } = req.body;

    if (!puzzleId) {
      return res.status(400).json({ success: false, message: 'Missing puzzleId in body' });
    }

    await db.none(`
      INSERT INTO User_Crossword_Stats (user_id, puzzle_id, completed)
      VALUES ($1, $2, TRUE)
      ON CONFLICT (user_id, puzzle_id)
      DO UPDATE SET completed = TRUE;
    `, [userId, puzzleId]);

    return res.json({ success: true, message: 'Puzzle marked as completed' });
  } catch (err) {
    console.error('Error marking puzzle complete:', err);
    res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});



app.get('/crossword', (req, res) => {
  res.render('pages/crossword', {user: req.session.user});
});



// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
