package models

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Topic struct {
	ID   int    `json:"id"`
	Topic string `json:"topic"`
}

func GetTopic(db *pgxpool.Pool) ([]Topic, error) {
	var topics []Topic
	rows, err := db.Query(context.Background(), "SELECT * FROM topics")
	if err != nil {
        return nil, err
    }
	defer rows.Close()
	for rows.Next() {
		var topic Topic
		err := rows.Scan(&topic.ID, &topic.Topic)
		if err != nil {
			return nil, err
		}
		topics = append(topics, topic)
	}
	return topics, nil
}