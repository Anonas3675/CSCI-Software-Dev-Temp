-- Example Insert Statements for each table

-- User_To_Backend
--INSERT INTO User_To_Backend (user_id) VALUES (1);
--INSERT INTO User_To_Backend (user_id) VALUES (1);

-- User_Information
-- INSERT INTO User_Information (username, user_id, password) VALUES ('dbtester', 1, 'rm');
--INSERT INTO User_Information (username, user_id, password) VALUES ('dbtester', 1, 'rm');

-- User_Wordle_Stats
--INSERT INTO User_Wordle_Stats (user_id, successful_attempts, games_played, win_streak, highest_win_streak) 
--VALUES (1, 25, 32, 2, 8);
--INSERT INTO User_Wordle_Stats (user_id, successful_attempts, games_played, win_streak, highest_win_streak) 
--VALUES (1, 25, 32, 2, 8);

-- User_Geoguessr_Stats
--INSERT INTO User_Geoguessr_Stats (user_id, highest_score) VALUES (1, 5000);
--INSERT INTO User_Geoguessr_Stats (user_id, highest_score) VALUES (1, 5000);

-- User_Trivia_Stats
--INSERT INTO User_Trivia_Stats (user_id, current_streak, highest_streak) VALUES (1, 6, 10);
--INSERT INTO User_Trivia_Stats (user_id, current_streak, highest_streak) VALUES (1, 6, 10);

-- User_Crossword_Stats
--INSERT INTO User_Crossword_Stats (user_id, successful_attempts) VALUES (1, 40);
--INSERT INTO User_Crossword_Stats (user_id, successful_attempts) VALUES (1, 40);

-- Geoguessr_Leaderboard
--INSERT INTO Geoguessr_Leaderboard (user_id, username, highscore) VALUES (1, 'example', 5000);
--INSERT INTO Geoguessr_Leaderboard (user_id, username, highscore) VALUES (1, 'example', 5000);

-- Trivia_Leaderboard
--INSERT INTO Trivia_Leaderboard (user_id, username, highest_streak) VALUES (1, 'example', 10);
--INSERT INTO Trivia_Leaderboard (user_id, username, highest_streak) VALUES (1, 'example', 10);

-- Wordle_Leaderboard
--INSERT INTO Wordle_Leaderboard (user_id, username, highest_streak) VALUES (1, 'example', 8);
--INSERT INTO Wordle_Leaderboard (user_id, username, highest_streak) VALUES (1, 'example', 8);

-- Crossword_Leaderboard
--INSERT INTO Crossword_Leaderboard (user_id, username, highest_streak) VALUES (2, 'example', 14);
--INSERT INTO Crossword_Leaderboard (user_id, username, highest_streak) VALUES (1, 'example', 14);

-- Insert the Crossword puzzle
INSERT INTO Crossword_Puzzles (puzzle_id, title, rows, columns)
VALUES (1, 'CU Puzzle', 12, 11);

-- Insert the grid structure
-- First define the black cells (is_black = TRUE)
INSERT INTO Crossword_Grid (puzzle_id, row_index, col_index, is_black)
VALUES 
--blacks for row 0
(1, 0, 0, TRUE),
(1, 0, 1, TRUE),
(1, 0, 2, TRUE),
(1, 0, 3, TRUE),
(1, 0, 5, TRUE),
(1, 0, 6, TRUE),
(1, 0, 7, TRUE),
(1, 0, 8, TRUE),
(1, 0, 9, TRUE),
(1, 0, 10, TRUE),

--blacks for row1
(1, 1, 0, TRUE),
(1, 1, 1, TRUE),
(1, 1, 2, TRUE),
(1, 1, 9, TRUE),
(1, 1, 10, TRUE),

--blacks for row2
(1, 2, 0, TRUE),
(1, 2, 1, TRUE),
(1, 2, 2, TRUE),
(1, 2, 3, TRUE),
(1, 2, 5, TRUE),
(1, 2, 6, TRUE),
(1, 2, 7, TRUE),
(1, 2, 8, TRUE),
(1, 2, 9, TRUE),
(1, 2, 10, TRUE),

--blacks for row3
(1, 3, 0, TRUE),
(1, 3, 1, TRUE),
(1, 3, 2, TRUE),

--blacks for row 4
(1, 4, 0, TRUE),
(1, 4, 1, TRUE),
(1, 4, 2, TRUE),
(1, 4, 3, TRUE),
(1, 4, 5, TRUE),
(1, 4, 7, TRUE),
(1, 4, 9, TRUE),
(1, 4, 10, TRUE),

--blakcs for row 5
(1, 5, 5, TRUE),
(1, 5, 10, TRUE),

--blacks for row 6
(1, 6, 0, TRUE),
(1, 6, 2, TRUE),
(1, 6, 3, TRUE),
(1, 6, 5, TRUE),
(1, 6, 7, TRUE),
(1, 6, 9, TRUE),
(1, 6, 10, TRUE),

--blacks for row 7
(1, 7, 0, TRUE),
(1, 7, 2, TRUE),
(1, 7, 3, TRUE),
(1, 7, 4, TRUE),
(1, 7, 5, TRUE),
(1, 7, 7, TRUE),
(1, 7, 9, TRUE),
(1, 7, 10, TRUE),

--blacks for row 8
(1, 8, 0, TRUE),
(1, 8, 6, TRUE),
(1, 8, 10, TRUE),

--blacks for row 9
(1, 9, 0, TRUE),
(1, 9, 2, TRUE),
(1, 9, 3, TRUE),
(1, 9, 4, TRUE),
(1, 9, 5, TRUE),
(1, 9, 6, TRUE),
(1, 9, 7, TRUE),
(1, 9, 8, TRUE),
(1, 9, 9, TRUE),
(1, 9, 10, TRUE),

--blacks row 10
(1, 10, 0, TRUE),
(1, 10, 2, TRUE),
(1, 10, 3, TRUE),
(1, 10, 4, TRUE),
(1, 10, 5, TRUE),
(1, 10, 6, TRUE),
(1, 10, 7, TRUE),
(1, 10, 8, TRUE),
(1, 10, 9, TRUE),
(1, 10, 10, TRUE),

--blacks for row 11
(1, 11, 0, TRUE),
(1, 11, 2, TRUE),
(1, 11, 3, TRUE),
(1, 11, 4, TRUE),
(1, 11, 5, TRUE),
(1, 11, 6, TRUE),
(1, 11, 7, TRUE),
(1, 11, 8, TRUE),
(1, 11, 9, TRUE),
(1, 11, 10, TRUE);


-- Now insert the other cells and set the cell numbers
INSERT INTO Crossword_Grid (puzzle_id, row_index, col_index, is_black, cell_number) VALUES

-- Row 0
(1, 0, 4, FALSE, 1),  -- Rockies (down)

-- Row 1
(1, 1, 3, FALSE, 2),  -- Norlin (across)
(1, 1, 4, FALSE, NULL),
(1, 1, 5, FALSE, NULL),
(1, 1, 6, FALSE, NULL),
(1, 1, 7, FALSE, NULL),
(1, 1, 8, FALSE, NULL),

--Row 2
(1, 2, 4, FALSE, NULL),

-- Row 3
(1, 3, 3, FALSE, 3),  -- Skobuffs (across)
(1, 3, 4, FALSE, NULL),
(1, 3, 5, FALSE, NULL),
(1, 3, 6, FALSE, 4),  -- BIG12 (down)
(1, 3, 7, FALSE, NULL),
(1, 3, 8, FALSE, 5),  -- Folsom (down)
(1, 3, 9, FALSE, NULL),
(1, 3, 10, FALSE, NULL),

-- Row 4
(1, 4, 4, FALSE, NULL),
(1, 4, 6, FALSE, NULL),
(1, 4, 8, FALSE, NULL),

-- Row 5
(1, 5, 0, FALSE, 6),  -- Prime (across)
(1, 5, 1, FALSE, 7),  -- Ralphie (down)
(1, 5, 2, FALSE, NULL),
(1, 5, 3, FALSE, NULL),
(1, 5, 4, FALSE, NULL),
(1, 5, 6, FALSE, 8),  -- Gold (across)
(1, 5, 7, FALSE, NULL),
(1, 5, 8, FALSE, NULL),
(1, 5, 9, FALSE, NULL),

-- Row 6
(1, 6, 1, FALSE, NULL),
(1, 6, 4, FALSE, NULL),
(1, 6, 6, FALSE, NULL),
(1, 6, 8, FALSE, NULL),

-- Row 7
(1, 7, 1, FALSE, NULL),
(1, 7, 6, FALSE, NULL),
(1, 7, 8, FALSE, NULL),

-- Row 8
(1, 8, 1, FALSE, 9),   -- Pearl (across)
(1, 8, 2, FALSE, NULL),
(1, 8, 3, FALSE, NULL),
(1, 8, 4, FALSE, NULL),
(1, 8, 5, FALSE, NULL),
(1, 8, 7, FALSE, 10),  -- UMC (across)
(1, 8, 8, FALSE, NULL),
(1, 8, 9, FALSE, NULL),

-- Row 9
(1, 9, 1, FALSE, NULL),

-- Row 10
(1, 10, 1, FALSE, NULL),

-- Row 11
(1, 11, 1, FALSE, NULL);


-- Insert the clues
INSERT INTO Crossword_Clues (puzzle_id, clue_number, direction, clue_text, answer, start_row, start_col)
VALUES
-- Across clues
(1, 2, 'across', 'CU library', 'NORLIN', 1, 3),
(1, 3, 'across', 'The famous saying at CU', 'SKOBUFFS', 3, 3),
(1, 6, 'across', 'CU head football coach', 'PRIME', 5, 0),
(1, 8, 'across', 'CU colors are black and __', 'GOLD', 5, 6),
(1, 9, 'across', 'Famous pedestrian mall in downtown Boulder', 'PEARL', 8, 1),
(1, 10, 'across', 'Name of CU student union building', 'UMC', 8, 7),

-- Down clues
(1, 1, 'down', 'Closest mountains to Boulder', 'ROCKIES', 0, 4),
(1, 4, 'down', 'CU sports conference', 'BIG12', 3, 6),
(1, 5, 'down', 'The name of CU Boulder football stadium', 'FOLSOM', 3, 8),
(1, 7, 'down', 'CU Mascot', 'RALPHIE', 5, 1);

-- Geo_Guessr_Location

INSERT INTO Geo_Guessr_Location (name, image_file, latitude, longitude) VALUES 
        ('Folsom Statue', 'FolsomStatue.jpg', 40.008712, -105.262970),
        ('Business Field', 'BusinessField.jpg', 40.007195, -105.262615),
        ('Farrand Field', 'FarrandField.jpg', 40.007322, -105.264290),
        ('Art Building', 'ArtBuilding.jpg', 40.007588, -105.265977),
        ('Planetarium', 'Planetarium.jpg', 40.006417, -105.263009);


        







--INSERT INTO Geo_Guessr_Location (location_id, name, image_file, latitude, longitude) VALUES (3, 'Engineering Center', '<file name>', 10.0, 20.0);
--INSERT INTO Geo_Guessr_Location (location_id, name, image_file, latitude, longitude) VALUES (3, 'Engineering Center', '<file name>', 10.0, 20.0);

-- Geo_Guessr_Scores
--INSERT INTO Geo_Guessr_Scores (id, user_id, location_id, score, distance) 
--VALUES (2, 1, 3, 5000, 421.5);
--INSERT INTO Geo_Guessr_Scores (id, user_id, location_id, score, distance) 
--VALUES (2, 1, 3, 5000, 421.5);

-- Wordle_Word_Bank
--INSERT INTO Wordle_Word_Bank (word) VALUES ('motor');
--INSERT INTO Wordle_Word_Bank (word) VALUES ('motor');

-- System_Wordle_Control
--INSERT INTO System_Wordle_Control (date, answer, number_of_guesses) VALUES ('2025-01-01', 'train', 6);
--INSERT INTO System_Wordle_Control (date, answer, number_of_guesses) VALUES ('2025-01-01', 'train', 6);

-- Trivia_Question_Bank
--INSERT INTO Trivia_Question_Bank (question_id, question, correct_answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3, difficulty) 
--VALUES (1092, 'What year was The University of Colorado, Boulder, founded?', '1876', '1869', '1873', '1878', 2);
--INSERT INTO Trivia_Question_Bank (question_id, question, correct_answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3, difficulty) 
--VALUES (1092, 'What year was The University of Colorado, Boulder, founded?', '1876', '1869', '1873', '1878', 2);