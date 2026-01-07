package models

import (
	"fmt"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Topic struct {
	ID   int    `json:"id"`
	Topic string `json:"topic"`
}

func GetTopic(db *pgxpool.Pool) ([]Topic, error) {
	var topics []Topic
	rows, err := db.Query(context.Background(), "SELECT id, topic FROM topics")
	if err != nil {
        return nil, fmt.Errorf("Error: %v", err)
    }
	defer rows.Close()
	for rows.Next() {
		var topic Topic
		err := rows.Scan(&topic.ID, &topic.Topic)
		if err != nil {
			return nil, fmt.Errorf("Error: %v", err)
		}
		topics = append(topics, topic)
	}
	return topics, err
}