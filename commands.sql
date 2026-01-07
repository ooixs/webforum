--All code is in postgreSQL
--Create the forum database
CREATE DATABASE forum;

--Create users table
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(100) UNIQUE
)

--Create topics table
CREATE TABLE topics (
	id SERIAL PRIMARY KEY,
	topic VARCHAR(100) UNIQUE
)

--Create posts table
CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	topic_id INTEGER REFERENCES topics(id),
	user_id INTEGER REFERENCES users(id),
	heading TEXT,
	content TEXT,
	time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

--Create replies table
CREATE TABLE replies (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT,
    time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

--Insert values into topics table
INSERT INTO topics(topics) VALUES ('Tech'), ('Games'), ('Lifestyle'), ('Music'), ('Automotive'), ('Culture')