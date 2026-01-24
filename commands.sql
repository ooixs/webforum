--All code is in postgreSQL
--Create the forum database
CREATE DATABASE forum;

--Create users table
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(100) UNIQUE NOT NULL
)

--Create topics table
CREATE TABLE topics (
	id SERIAL PRIMARY KEY,
	topic VARCHAR(100) UNIQUE NOT NULL,
	topic_icon VARCHAR(100) NOT NULL
)

--Create posts table
CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	topic_id INTEGER REFERENCES topics(id),
	user_id INTEGER REFERENCES users(id),
	heading TEXT NOT NULL,
	content TEXT NOT NULL,
	time_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	time_edited TIMESTAMPTZ,
)

--Create replies table
CREATE TABLE replies (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    time_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	time_edited TIMESTAMPTZ,
)

--Insert values into topics table
INSERT INTO topics(topic, topic_icon) VALUES ('Tech', 'techIcon'), ('Games', 'gamesIcon'), ('Lifestyle', 'lifestyleIcon'), ('Music', 'musicIcon'), ('Automotive', 'automotiveIcon'), ('Culture', 'cultureIcon')