package models

import (
	"context"
	"database/sql"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Post struct {
	ID   int    `json:"id"`
	TopicId int `json:"topic_id"`
	UserId int `json:"user_id"`
	Heading string `json:"heading"`
	Content string `json:"content"`
	TimeCreated string `json:"time_created"`
	TimeEdited string `json:"time_edited"`
}

//Gets all posts for a topic
func GetPosts(db *pgxpool.Pool, topicId int) ([]Post, error) {
	var posts []Post
	rows, err := db.Query(context.Background(), "SELECT * FROM posts WHERE topic_id=$1 ORDER BY time_created DESC", topicId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var post Post
		var unformattedTime time.Time
		var unformattedEditTime sql.NullTime
		err := rows.Scan(&post.ID, &post.TopicId, &post.UserId, &post.Heading, &post.Content, &unformattedTime, &unformattedEditTime)
		if err != nil {
			return nil, err
		}
		post.TimeCreated = unformattedTime.Format("02 Jan 2006 at 15:04")
		if unformattedEditTime.Valid {
			post.TimeEdited = unformattedEditTime.Time.Format("02 Jan 2006 at 15:04")
		} else {
			post.TimeEdited = ""
		}
		posts = append(posts, post)
	}
	return posts, nil
}

//Adds a newly created post to the database
func CreatePost(db *pgxpool.Pool, topicId int, userId int, heading string, content string) (error) {
	_, err := db.Exec(context.Background(), "INSERT INTO posts (topic_id, user_id, heading, content) VALUES ($1, $2, $3, $4)", topicId, userId, heading, content)
	return err
}

//Updates the post heading and content in the database
func UpdatePost(db *pgxpool.Pool, postId int, heading string, content string) error {
	_, err := db.Exec(context.Background(), "UPDATE posts SET heading=$1, content=$2, time_edited=CURRENT_TIMESTAMP WHERE id=$3", heading, content, postId)
	return err
}

//Deletes the post in the database
func DeletePost(db *pgxpool.Pool, postId int) error {
	//Also deletes all replies associated with the post
	_, err := db.Exec(context.Background(), "DELETE FROM replies WHERE post_id=$1", postId)
	if err != nil {
		return err
	}
	_, err = db.Exec(context.Background(), "DELETE FROM posts WHERE id=$1", postId)
	return err
}

//Gets the topic associated with the posts
func GetTopicForPosts(db *pgxpool.Pool, topicId int) (string, error) {
	var topicName string
	row := db.QueryRow(context.Background(), "SELECT topic FROM topics WHERE id=$1", topicId)
	err := row.Scan(&topicName)
	return topicName, err
}