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
VALUES (1, 'CU Puzzle #1', 12, 11);

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

--blacks for row 5
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




-- Insert the Crossword puzzle
INSERT INTO Crossword_Puzzles (puzzle_id, title, rows, columns)
VALUES (2, 'CU Puzzle #2', 9, 14);

-- Insert the grid structure
-- First define the black cells (is_black = TRUE)
INSERT INTO Crossword_Grid (puzzle_id, row_index, col_index, is_black)
VALUES 
--blacks for row 0
(2, 0, 0, TRUE),
(2, 0, 1, TRUE),
(2, 0, 2, TRUE),
(2, 0, 3, TRUE),
(2, 0, 4, TRUE),
(2, 0, 6, TRUE),
(2, 0, 7, TRUE),
(2, 0, 8, TRUE),
(2, 0, 9, TRUE),
(2, 0, 10, TRUE),
(2, 0, 12, TRUE),
(2, 0, 13, TRUE),

--blacks for row1
(2, 1, 0, TRUE),
(2, 1, 2, TRUE),
(2, 1, 3, TRUE),
(2, 1, 4, TRUE),
(2, 1, 6, TRUE),

--blacks for row2
(2, 2, 4, TRUE),
(2, 2, 6, TRUE),
(2, 2, 8, TRUE),
(2, 2, 9, TRUE),
(2, 2, 10, TRUE),
(2, 2, 12, TRUE),
(2, 2, 13, TRUE),

--blacks for row3
(2, 3, 0, TRUE),
(2, 3, 2, TRUE),
(2, 3, 4, TRUE),
(2, 3, 6, TRUE),
(2, 3, 8, TRUE),
(2, 3, 9, TRUE),
(2, 3, 10, TRUE),
(2, 3, 12, TRUE),
(2, 3, 13, TRUE),

--blacks for row 4
(2, 4, 0, TRUE),
(2, 4, 2, TRUE),
(2, 4, 6, TRUE),
(2, 4, 8, TRUE),
(2, 4, 10, TRUE),
(2, 4, 12, TRUE),
(2, 4, 13, TRUE),

--blakcs for row 5
(2, 5, 0, TRUE),
(2, 5, 2, TRUE),
(2, 5, 4, TRUE),
(2, 5, 12, TRUE),
(2, 5, 13, TRUE),

--blacks for row 6
(2, 6, 0, TRUE),
(2, 6, 1, TRUE),
(2, 6, 2, TRUE),
(2, 6, 4, TRUE),
(2, 6, 6, TRUE),
(2, 6, 8, TRUE),
(2, 6, 10, TRUE),
(2, 6, 12, TRUE),
(2, 6, 13, TRUE),

--blacks for row 7
(2, 7, 0, TRUE),
(2, 7, 1, TRUE),
(2, 7, 2, TRUE),
(2, 7, 3, TRUE),
(2, 7, 4, TRUE),
(2, 7, 5, TRUE),
(2, 7, 6, TRUE),
(2, 7, 8, TRUE),
(2, 7, 10, TRUE),
(2, 7, 12, TRUE),
(2, 7, 13, TRUE),

--blacks for row 8
(2, 8, 0, TRUE),
(2, 8, 1, TRUE),
(2, 8, 2, TRUE),
(2, 8, 3, TRUE),
(2, 8, 4, TRUE),
(2, 8, 5, TRUE),
(2, 8, 6, TRUE),
(2, 8, 8, TRUE),
(2, 8, 10, TRUE),
(2, 8, 11, TRUE),
(2, 8, 12, TRUE),
(2, 8, 13, TRUE);

-- Now insert the other cells and set the cell numbers
INSERT INTO Crossword_Grid (puzzle_id, row_index, col_index, is_black, cell_number) VALUES

-- Row 0
(2, 0, 5, FALSE, 1),
(2, 0, 11, FALSE, 2), 

-- Row 1
(2, 1, 1, FALSE, 3),
(2, 1, 5, FALSE, NULL),
(2, 1, 7, FALSE, 4),
(2, 1, 8, FALSE, NULL),
(2, 1, 9, FALSE, NULL),
(2, 1, 10, FALSE, NULL),
(2, 1, 11, FALSE, NULL),
(2, 1, 12, FALSE, NULL),
(2, 1, 13, FALSE, NULL),

--Row 2
(2, 2, 0, FALSE, 5),
(2, 2, 1, FALSE, NULL),
(2, 2, 2, FALSE, NULL),
(2, 2, 3, FALSE, 6),
(2, 2, 5, FALSE, NULL),
(2, 2, 7, FALSE, NULL),
(2, 2, 11, FALSE, NULL),

-- Row 3
(2, 3, 1, FALSE, NULL),
(2, 3, 3, FALSE, NULL),
(2, 3, 5, FALSE, NULL),
(2, 3, 7, FALSE, NULL),
(2, 3, 11, FALSE, NULL),

-- Row 4
(2, 4, 1, FALSE, NULL),
(2, 4, 3, FALSE, 7),
(2, 4, 4, FALSE, NULL),
(2, 4, 5, FALSE, NULL),
(2, 4, 7, FALSE, NULL),
(2, 4, 9, FALSE, 8),
(2, 4, 11, FALSE, NULL),

-- Row 5
(2, 5, 1, FALSE, NULL),
(2, 5, 3, FALSE, NULL),
(2, 5, 5, FALSE, 9),
(2, 5, 6, FALSE, NULL),
(2, 5, 7, FALSE, NULL),
(2, 5, 8, FALSE, NULL),
(2, 5, 9, FALSE, NULL),
(2, 5, 10, FALSE, NULL),
(2, 5, 11, FALSE, NULL),

-- Row 6
(2, 6, 3, FALSE, NULL),
(2, 6, 5, FALSE, NULL),
(2, 6, 7, FALSE, NULL),
(2, 6, 9, FALSE, NULL),
(2, 6, 11, FALSE, NULL),

-- Row 7
(2, 7, 7, FALSE, NULL),
(2, 7, 9, FALSE, NULL),
(2, 7, 11, FALSE, NULL),

-- Row 8
(2, 8, 7, FALSE, NULL),
(2, 8, 9, FALSE, NULL);


-- Insert the clues
INSERT INTO Crossword_Clues (puzzle_id, clue_number, direction, clue_text, answer, start_row, start_col)
VALUES
-- Across clues
(2, 4, 'across', 'Former CU basketball player & winner of the 2004 NBA Finals', 'BILLUPS', 1, 7),
(2, 5, 'across', 'CU humanoid mascot', 'CHIP', 2, 0),
(2, 7, 'across', 'Biggest dining hall on campus', 'C4C', 4, 3),
(2, 9, 'across', 'First building on the CU Boulder campus', 'OLDMAIN', 5, 5),

-- Down clues
(2, 1, 'down', 'Keith Miller pro team', 'BRONCOS', 0, 5),
(2, 2, 'down', 'Business and engineering connector', 'RUSTANDY', 0, 11),
(2, 3, 'down', 'Former CU basketball player & winner of 2024 NBA Finals', 'WHITE', 1, 1),
(2, 4, 'down', 'Main road running through campus', 'BROADWAY', 1, 7),
(2, 6, 'down', 'Previous CU football conference', 'PAC12', 2, 3),
(2, 8, 'down', 'Da Silva new basketball team', 'MAGIC', 4, 9);


-- Geo_Guessr_Location

INSERT INTO Geo_Guessr_Location (name, image_file, latitude, longitude) VALUES 
        ('Folsom Statue', 'FolsomStatue.jpg', 40.008738, -105.262925),
        ('Business Field', 'BusinessField.jpg',  40.007204, -105.262608),
        ('Farrand Field', 'FarrandField.jpg', 40.007293, -105.264333),
        ('Art Building', 'ArtBuilding.jpg',40.007567, -105.265983),
        ('Planetarium', 'Planetarium.jpg',  40.006415, -105.263075);





        







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

-- Trivia_Question_Bank
INSERT INTO Trivia_Question_Bank (question_id, question, correct_answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3, difficulty) VALUES
(2001, 'What year was CU founded?', '1876', '1863', '1907', '1935', 2),
(2002, 'What is CU’s mascot?', 'Ralphie the Buffalo', 'CAM the Ram', 'Rocky the Mountain Lion', 'Victor E. Bull', 1),
(2003, 'What is the famous rock formation near CU Boulder?', 'Flatirons', 'Rocky Moutains', 'Garden of the Gods', 'Red Rocks', 2),
(2004, 'What is the name of CU’s football Stadium?', 'Folsom Field', 'Farrand Field', 'Kittridge Field', 'William''s Field', 2),
(2005, 'Who is CU’s head football coach?', 'Deion Sanders', 'Jim Irsay', 'Jim Harbaugh', 'Tad Boyle', 1),
(2006, 'What chant do students say during football games?', 'SKO BUFFS', 'Rock Chalk Jay Hawk', 'GOOOO Buffaloes!', 'STAMPEDE', 2),
(2007, 'What is the name of CU’s marching band?', 'Golden Buffaloes', 'Marching Buffaloes', 'Black and Gold Buffaloes', 'Chanting Buffaloes', 3),
(2008, 'What is the name of CU’s library?', 'Norlin Library', 'Dawson Library', 'Prime Library', 'William Library', 1),
(2009, 'What is the largest major in the school of Engineering (by students) at CU?', 'Aerospace Engineering', 'Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 2),
(2010, 'What school is CU’s biggest rival?', 'Colorado State University', 'University of Kansas', 'University of Nebraska', 'Colorado School of Mines', 1),
(2011, 'Where is the largest collection of dorms within main campus?', 'Kittridge', 'Old Main', 'Central Campus', 'William’s Village', 1),
(2012, 'Where is the largest collection of dorms outside main campus?', 'William’s Village', 'Old Main', 'East Campus', 'Kittridge', 1),
(2013, 'What is the name of the oldest section of CU’s campus?', 'Old main', 'East Campus', 'Central Campus', 'Old campus', 2),
(2014, 'What is CU Boulder’s Elevation?', '5,430', '5,280', '5,060', '5,120', 3),
(2015, 'What Ski resort does Boulder have free bus rides to?', 'Eldora', 'Winter Park', 'Keystone', 'Vail', 2);