package models

import (
	"context"
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
}

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
		err := rows.Scan(&post.ID, &post.TopicId, &post.UserId, &post.Heading, &post.Content, &unformattedTime)
		if err != nil {
			return nil, err
		}
		post.TimeCreated = unformattedTime.Format("02 Jan 2006 at 15:03")
		posts = append(posts, post)
	}
	return posts, nil
}

func CreatePost(db *pgxpool.Pool, topicId int, userId int, heading string, content string) (error) {
	_, err := db.Exec(context.Background(), "INSERT INTO posts (topic_id, user_id, heading, content) VALUES ($1, $2, $3, $4)", topicId, userId, heading, content)
	return err
}

func UpdatePost(db *pgxpool.Pool, postId int, heading string, content string) error {
	_, err := db.Exec(context.Background(), "UPDATE posts SET heading=$1, content=$2 WHERE id=$3", heading, content, postId)
	return err
}

func DeletePost(db *pgxpool.Pool, postId int) error {
	_, err := db.Exec(context.Background(), "DELETE FROM replies WHERE post_id=$1", postId)
	if err != nil {
		return err
	}
	_, err = db.Exec(context.Background(), "DELETE FROM posts WHERE id=$1", postId)
	return err
}

func GetTopicForPosts(db *pgxpool.Pool, topicId int) (*Topic, error) {
	var topic Topic
	row := db.QueryRow(context.Background(), "SELECT * FROM topics WHERE id=$1", topicId)
	err := row.Scan(&topic.ID, &topic.Topic)
	return &topic, err
}