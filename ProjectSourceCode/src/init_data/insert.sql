-- Example Insert Statements for each table

-- User_To_Backend
INSERT INTO User_To_Backend (user_id) VALUES (1);

-- User_Information
INSERT INTO User_Information (username, user_id, password, email_address) VALUES ('example', 1, 'pword', 'example@gmail.com');

-- User_Wordle_Stats
INSERT INTO User_Wordle_Stats (user_id, successful_attempts, games_played, win_streak, highest_win_streak) 
VALUES (1, 25, 32, 2, 8);

-- User_Geoguesser_Stats
INSERT INTO User_Geoguesser_Stats (user_id, highest_score) VALUES (1, 5000);

-- User_Trivia_Stats
INSERT INTO User_Trivia_Stats (user_id, current_streak, highest_streak) VALUES (1, 6, 10);

-- User_Crossword_Stats
INSERT INTO User_Crossword_Stats (user_id, successful_attempts) VALUES (1, 40);

-- Geoguesser_Leaderboard
INSERT INTO Geoguesser_Leaderboard (user_id, username, highscore) VALUES (1, 'example', 5000);

-- Trivia_Leaderboard
INSERT INTO Trivia_Leaderboard (user_id, username, highest_streak) VALUES (1, 'example', 10);

-- Wordle_Leaderboard
INSERT INTO Wordle_Leaderboard (user_id, username, highest_streak) VALUES (1, 'example', 8);

-- Crossword_Leaderboard
INSERT INTO Crossword_Leaderboard (user_id, username, highest_streak) VALUES (1, 'example', 14);

-- Crossword_Bank
INSERT INTO Crossword_Bank (crossword_id) VALUES (12345);

-- System_Crossword_Row_Control
INSERT INTO System_Crossword_Row_Control (crossword_id, row_number, word, hint) 
VALUES (12345, 1, 'example', 'A term illustrating a certain topic/thing');

-- System_Crossword_Column_Control
INSERT INTO System_Crossword_Column_Control (crossword_id, column_number, word, hint) 
VALUES (12345, 2, 'school', 'A place of education');

-- Image_Bank
INSERT INTO Image_Bank (image_id, image_location) VALUES (231, '../resources/images/<filename>');

-- Geoguesser_Location_Bank
INSERT INTO Geoguesser_Location_Bank (location_id, name, coordinates, image_id) VALUES (3, 'Engineering Center', '<coordinates>', 231);

-- Wordle_Word_Bank
INSERT INTO Wordle_Word_Bank (word) VALUES ('motor');

-- System_Wordle_Control
INSERT INTO System_Wordle_Control (date, answer, number_of_guesses) VALUES ('2025-01-01', 'train', 6);

-- Trivia_Question_Bank
INSERT INTO Trivia_Question_Bank (question_id, question, correct_answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3, difficulty) 
VALUES (1092, 'What year was The University of Colorado, Boulder, founded?', '1876', '1869', '1873', '1878', 2);

-- System_Geoguesser_Control
INSERT INTO System_Geoguesser_Control (correct_location_id, user_current_score, current_round) VALUES (7, 3598, 4);