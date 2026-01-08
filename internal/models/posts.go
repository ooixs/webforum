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
	TimeCreated time.Time `json:"time_created"`
}

func GetPost(db *pgxpool.Pool, topicId int) ([]Post, error) {
	var posts []Post
	rows, err := db.Query(context.Background(), "SELECT * FROM posts WHERE topic_id=$1", topicId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var post Post
		err := rows.Scan(&post.ID, &post.TopicId, &post.UserId, &post.Heading, &post.Content, &post.TimeCreated)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}
func CreatePost(db *pgxpool.Pool, topicId int, userId int, heading string, content string) (int, error) {
	var postId int
	row := db.QueryRow(context.Background(), "INSERT INTO posts (topic_id, user_id, heading, content) VALUES ($1, $2, $3, $4) RETURNING id", topicId, userId, heading, content)
	err := row.Scan(&postId)
	return postId, err
}