package models

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Reply struct {
	ID   int    `json:"id"`
	PostId int `json:"post_id"`
	UserId int `json:"user_id"`
	Content string `json:"content"`
	TimeCreated time.Time `json:"time_created"`
	TimeEdited *time.Time `json:"time_edited,omitempty"`
}

//Gets all replies for a post
func GetReplies(db *pgxpool.Pool, postId int) ([]Reply, error) {
	var replies []Reply
	rows, err := db.Query(context.Background(), "SELECT * FROM replies WHERE post_id=$1 ORDER BY time_created DESC", postId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var reply Reply
		err := rows.Scan(&reply.ID, &reply.PostId, &reply.UserId, &reply.Content, &reply.TimeCreated, &reply.TimeEdited)
		if err != nil {
			return nil, err
		}
		if reply.TimeEdited != nil && reply.TimeEdited.IsZero() {
			reply.TimeEdited = nil
		}
		replies = append(replies, reply)
	}
	return replies, nil
}

//Adds a newly created reply to the database
func CreateReply(db *pgxpool.Pool, postId int, userId int, content string) error {
	_, err := db.Exec(context.Background(), "INSERT INTO replies (post_id, user_id, content) VALUES ($1, $2, $3)", postId, userId, content)
	return err
}

//Updates the reply content in the database
func UpdateReply(db *pgxpool.Pool, replyId int, content string) error {
	_, err := db.Exec(context.Background(), "UPDATE replies SET content=$1, time_edited=CURRENT_TIMESTAMP WHERE id=$2", content, replyId)
	return err
}

//Deletes the reply in the database
func DeleteReply(db *pgxpool.Pool, replyId int) error {
	_, err := db.Exec(context.Background(), "DELETE FROM replies WHERE id=$1", replyId)
	return err
}

//Gets the post associated with the replies
func GetPostForReplies(db *pgxpool.Pool, postId int) (*Post, error) {
	var post Post
	row := db.QueryRow(context.Background(), "SELECT * FROM posts WHERE id=$1", postId)
	err := row.Scan(&post.ID, &post.TopicId, &post.UserId, &post.Heading, &post.Content, &post.TimeCreated, &post.TimeEdited)
	if post.TimeEdited != nil && post.TimeEdited.IsZero() {
		post.TimeEdited = nil
	}
	return &post, err
}