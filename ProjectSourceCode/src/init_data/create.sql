-- Table used purely to store user ids and connect the user's information and leaderboards using the id
DROP TABLE IF EXISTS user_to_backend;
CREATE TABLE user_to_backend (
    user_id SERIAL PRIMARY KEY
);

-- Used as the main table holding user information
DROP TABLE IF EXISTS user_information;
CREATE TABLE user_information (
    username VARCHAR(45) PRIMARY KEY,
    user_id INT UNIQUE,
    password VARCHAR(45) NOT NULL,
    email_address VARCHAR(45) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_to_backend(user_id)
);

-- Uses user_id from the User_information to show user wordle stats
DROP TABLE IF EXISTS User_Wordle_Stats;
CREATE TABLE User_Wordle_Stats (
    user_id INT PRIMARY KEY,
    successful_attempts INT,
    games_played INT,
    win_streak INT,
    highest_win_streak INT,
    FOREIGN KEY (user_id) REFERENCES user_information(user_id)
);

-- Uses user_id from the User_information to show user geoguesser stats
DROP TABLE IF EXISTS User_Geoguesser_Stats;
CREATE TABLE User_Geoguesser_Stats (
    user_id INT PRIMARY KEY,
    highest_score INT,
    FOREIGN KEY (user_id) REFERENCES user_information(user_id)
);

-- Uses user_id from the User_information to show user trivia stats
DROP TABLE IF EXISTS User_Trivia_Stats;
CREATE TABLE User_Trivia_Stats (
    user_id INT PRIMARY KEY,
    current_streak INT,
    highest_streak INT,
    FOREIGN KEY (user_id) REFERENCES user_information(user_id)
);

-- Uses user_id from the User_information to show user crossword stats
DROP TABLE IF EXISTS User_Crossword_Stats;
CREATE TABLE User_Crossword_Stats (
    user_id INT PRIMARY KEY,
    successful_attempts INT,
    FOREIGN KEY (user_id) REFERENCES user_information(user_id)
);

-- Shows the leaderboard for geoguesser using user_id's from user_to_backend
DROP TABLE IF EXISTS Geoguesser_Leaderboard;
CREATE TABLE Geoguesser_Leaderboard (
    user_id INT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    highscore INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_to_backend(user_id)
);

-- Shows the leaderboard for trivia using user_id's from user_to_backend
DROP TABLE IF EXISTS Trivia_Leaderboard;
CREATE TABLE Trivia_Leaderboard (
    user_id INT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    highest_streak INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_to_backend(user_id)
);

-- Shows the leaderboard for wordle using user_id's from user_to_backend
DROP TABLE IF EXISTS Wordle_Leaderboard;
CREATE TABLE Wordle_Leaderboard (
    user_id INT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    highest_streak INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_to_backend(user_id)
);

-- Shows the leaderboard for crossword using user_id's from user_to_backend
DROP TABLE IF EXISTS Crossword_Leaderboard;
CREATE TABLE Crossword_Leaderboard (
    user_id INT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    highest_streak INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_to_backend(user_id)
);

-- Stores the unique id for each crossword, which is used to access the independent rows and columns of the crossword
DROP TABLE IF EXISTS Crossword_Bank;
CREATE TABLE Crossword_Bank (
    crossword_id SERIAL PRIMARY KEY
);

-- Holds the information for a single row of the crossword
DROP TABLE IF EXISTS System_Crossword_Row_Control;
CREATE TABLE System_Crossword_Row_Control (
    crossword_id INT PRIMARY KEY,
    row_number INT NOT NULL,
    word VARCHAR(45) NOT NULL,
    hint VARCHAR(200) NOT NULL,
    FOREIGN KEY (crossword_id) REFERENCES Crossword_Bank(crossword_id)
);

-- Holds the information for a single column of the crossword
DROP TABLE IF EXISTS System_Crossword_Column_Control;
CREATE TABLE System_Crossword_Column_Control (
    crossword_id INT PRIMARY KEY,
    column_number INT NOT NULL,
    word VARCHAR(45) NOT NULL,
    hint VARCHAR(200) NOT NULL,
    FOREIGN KEY (crossword_id) REFERENCES Crossword_Bank(crossword_id)
);

-- Stores the image_id and the file location of an image to use furing the geoguesser game
DROP TABLE IF EXISTS Image_Bank;
CREATE TABLE Image_Bank (
    image_id SERIAL PRIMARY KEY,
    image_location VARCHAR(100) NOT NULL
);

-- Stores information about each possible geoguesser location, alongside the image_id for each location
DROP TABLE IF EXISTS Geoguesser_Location_Bank;
CREATE TABLE Geoguesser_Location_Bank (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    coordinates VARCHAR(45) NOT NULL,
    image_id INT UNIQUE,
    FOREIGN KEY (image_id) REFERENCES Image_Bank(image_id)
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

-- Used during the geoguesser game to hold data on the correct location, and the user's score for the game
DROP TABLE IF EXISTS System_Geoguesser_Control;
CREATE TABLE System_Geoguesser_Control (
    correct_location_id SERIAL PRIMARY KEY,
    user_current_score INT,
    current_round INT
);