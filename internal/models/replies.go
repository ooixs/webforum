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
	TimeCreated string `json:"time_created"`
	Edited bool `json:"edited"`
}

func GetReplies(db *pgxpool.Pool, postId int) ([]Reply, error) {
	var replies []Reply
	rows, err := db.Query(context.Background(), "SELECT * FROM replies WHERE post_id=$1 ORDER BY time_created DESC", postId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var reply Reply
		var unformattedTime time.Time
		err := rows.Scan(&reply.ID, &reply.PostId, &reply.UserId, &reply.Content, &unformattedTime, &reply.Edited)
		if err != nil {
			return nil, err
		}
		reply.TimeCreated = unformattedTime.Format("02 Jan 2006 at 15:03")
		replies = append(replies, reply)
	}
	return replies, nil
}
func CreateReply(db *pgxpool.Pool, postId int, userId int, content string) (error) {
	_, err := db.Exec(context.Background(), "INSERT INTO replies (post_id, user_id, content) VALUES ($1, $2, $3)", postId, userId, content)
	return err
}

func UpdateReply(db *pgxpool.Pool, replyId int, content string) error {
	_, err := db.Exec(context.Background(), "UPDATE replies SET content=$1, edited=true WHERE id=$2", content, replyId)
	return err
}

func DeleteReply(db *pgxpool.Pool, replyId int) error {
	_, err := db.Exec(context.Background(), "DELETE FROM replies WHERE id=$1", replyId)
	return err
}

func GetPostForReplies(db *pgxpool.Pool, postId int) (*Post, error) {
	var post Post
	var unformattedTime time.Time
	row := db.QueryRow(context.Background(), "SELECT * FROM posts WHERE id=$1", postId)
	err := row.Scan(&post.ID, &post.TopicId, &post.UserId, &post.Heading, &post.Content, &unformattedTime, &post.Edited)
	post.TimeCreated = unformattedTime.Format("02 Jan 2006 at 15:03")
	return &post, err
}