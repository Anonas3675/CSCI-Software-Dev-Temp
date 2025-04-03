--USER INFO
-- Table used purely to store user ids and connect the user's information and leaderboards using the id
DROP TABLE IF EXISTS User_To_Backend;
CREATE TABLE User_To_Backend (
    user_id SERIAL PRIMARY KEY
);

-- Used as the main table holding user information
DROP TABLE IF EXISTS User_Information;
CREATE TABLE User_Information (
    username VARCHAR(45) PRIMARY KEY,
    user_id INT UNIQUE,
    user_id INT UNIQUE DEFAULT nextval('user_to_backend_user_id_seq'),
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User_To_Backend(user_id) ON DELETE CASCADE
);


--GEOGUESSR
-- Uses user_id from the User_information to show user geoguessr stats
DROP TABLE IF EXISTS User_Geoguessr_Stats;
CREATE TABLE User_Geoguessr_Stats (
    user_id INT PRIMARY KEY,
    highest_score INT,
    FOREIGN KEY (user_id) REFERENCES User_Information(user_id)
);

-- Shows the leaderboard for geoguessr using user_id's from User_To_Backend
DROP TABLE IF EXISTS Geoguessr_Leaderboard;
CREATE TABLE Geoguessr_Leaderboard (
    user_id INT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    highscore INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User_To_Backend(user_id)
);

-- Stores information about each possible geoguessr location, alongside the image_id for each location
DROP TABLE IF EXISTS Geo_Guessr_Location;
CREATE TABLE Geo_Guessr_Location (
    location_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, --Location Name
    image_file VARCHAR(255) NOT NULL,  -- image file name
    latitude DECIMAL(9,6) NOT NULL,  -- Latitude 
    longitude DECIMAL(9,6) NOT NULL  -- Longitude
);

-- Stores the scores for geoguessr
DROP TABLE IF EXISTS Geo_Guessr_Scores;
CREATE TABLE Geo_Guessr_Scores (
    id INT PRIMARY KEY,
    user_id INT NOT NULL,
    location_id INT NOT NULL,
    score INT NOT NULL,  -- Points awarded based on distance
    distance DECIMAL(6,2) NOT NULL,  -- How far they were (in km)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User_Information(user_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES Geo_Guessr_Location(location_id) ON DELETE CASCADE
);


--WORDLE
-- Uses user_id from the User_information to show user wordle stats
DROP TABLE IF EXISTS User_Wordle_Stats;
CREATE TABLE User_Wordle_Stats (
    user_id INT PRIMARY KEY,
    successful_attempts INT,
    games_played INT,
    win_streak INT,
    highest_win_streak INT,
    FOREIGN KEY (user_id) REFERENCES User_Information(user_id)
);

-- Shows the leaderboard for wordle using user_id's from User_To_Backend
DROP TABLE IF EXISTS Wordle_Leaderboard;
CREATE TABLE Wordle_Leaderboard (
    user_id INT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    highest_streak INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User_To_Backend(user_id)
);

-- Stores valid 5-letter words which the user can input as an answer
DROP TABLE IF EXISTS Wordle_Word_Bank;
CREATE TABLE Wordle_Word_Bank (
    word CHAR(5) PRIMARY KEY
);

-- Determines the correct 5-letter word for the daily wordle using the date, also holds the number of guesses the user has used
DROP TABLE IF EXISTS System_Wordle_Control;
CREATE TABLE System_Wordle_Control (
    date DATE PRIMARY KEY,
    answer CHAR(5) NOT NULL,
    number_of_guesses INT
);


--TRIVIA
-- Uses user_id from the User_information to show user trivia stats
DROP TABLE IF EXISTS User_Trivia_Stats;
CREATE TABLE User_Trivia_Stats (
    user_id INT PRIMARY KEY,
    current_streak INT,
    highest_streak INT,
    FOREIGN KEY (user_id) REFERENCES User_Information(user_id)
);

-- Shows the leaderboard for trivia using user_id's from User_To_Backend
DROP TABLE IF EXISTS Trivia_Leaderboard;
CREATE TABLE Trivia_Leaderboard (
    user_id INT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    highest_streak INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User_To_Backend(user_id)
);

-- Stores information about trivia questions, including the question, the correct answer, incorrect answers, and the difficulty
DROP TABLE IF EXISTS Trivia_Question_Bank;
CREATE TABLE Trivia_Question_Bank (
    question_id INT PRIMARY KEY,
    question VARCHAR(200) NOT NULL,
    correct_answer VARCHAR(45) NOT NULL,
    incorrect_answer_1 VARCHAR(45) NOT NULL,
    incorrect_answer_2 VARCHAR(45) NOT NULL,
    incorrect_answer_3 VARCHAR(45) NOT NULL,
    difficulty INT CHECK (difficulty < 4 AND difficulty > 0)
);


--CROSSWORD
-- Uses user_id from the User_information to show user crossword stats
DROP TABLE IF EXISTS User_Crossword_Stats;
CREATE TABLE User_Crossword_Stats (
    user_id INT PRIMARY KEY,
    successful_attempts INT,
    FOREIGN KEY (user_id) REFERENCES User_Information(user_id)
);

-- Shows the leaderboard for crossword using user_id's from user_to_backend
DROP TABLE IF EXISTS Crossword_Leaderboard;
CREATE TABLE Crossword_Leaderboard (
    user_id INT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    highest_streak INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User_To_Backend(user_id)
);

-- Stores the unique id for each crossword puzzle
DROP TABLE IF EXISTS Crossword_Puzzles CASCADE;
CREATE TABLE Crossword_Puzzles (
    puzzle_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    rows INT NOT NULL,
    columns INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  --Check if being made
);

-- Stores the grid structure (black vs. fillable cells)
DROP TABLE IF EXISTS Crossword_Grid CASCADE;
CREATE TABLE Crossword_Grid (
    grid_id SERIAL PRIMARY KEY,
    puzzle_id INT NOT NULL,
    row_index INT NOT NULL,
    col_index INT NOT NULL,
    is_black BOOLEAN NOT NULL DEFAULT FALSE,
    cell_number INT NULL,
    FOREIGN KEY (puzzle_id) REFERENCES Crossword_Puzzles(puzzle_id)
);

-- Stores the clues and answers
DROP TABLE IF EXISTS Crossword_Clues CASCADE;
CREATE TABLE Crossword_Clues (
    clue_id SERIAL PRIMARY KEY,
    puzzle_id INT NOT NULL,
    clue_number INT NOT NULL,
    direction VARCHAR(6) NOT NULL CHECK (direction IN ('across', 'down')),
    clue_text VARCHAR(200) NOT NULL,
    answer VARCHAR(45) NOT NULL, 
    start_row INT NOT NULL,
    start_col INT NOT NULL,
    FOREIGN KEY (puzzle_id) REFERENCES Crossword_Puzzles(puzzle_id)
);

-- Stores user progress on puzzles. Not sure if I'll implement this but might try later
DROP TABLE IF EXISTS User_Puzzle_Progress CASCADE;
CREATE TABLE User_Puzzle_Progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    puzzle_id INT NOT NULL,
    row_index INT NOT NULL,
    col_index INT NOT NULL,
    user_letter CHAR(1) NULL,
    FOREIGN KEY (puzzle_id) REFERENCES Crossword_Puzzles(puzzle_id)
);