CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(60) NOT NULL,
    geoguessr_high_score INT DEFAULT 0,  -- Stores the best score in Geoguessr
);


CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, --Location Name
    image_file VARCHAR(255) NOT NULL,  -- image file name
    latitude DECIMAL(9,6) NOT NULL,  -- Latitude 
    longitude DECIMAL(9,6) NOT NULL,  -- Longitude
);


CREATE TABLE geoGuessrScoresTable (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    location_id INT NOT NULL,
    score INT NOT NULL,  -- Points awarded based on distance
    distance DECIMAL(6,2) NOT NULL,  -- How far they were (in km)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

