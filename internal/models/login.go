package models

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID   int    `json:"id"`
	Username string `json:"username"`
}

func GetUser(db *pgxpool.Pool, username string) (*User, error) {
	var user User
	row := db.QueryRow(context.Background(), "SELECT id, username FROM users WHERE username=$1", username)
	err := row.Scan(&user.ID, &user.Username)
	return &user, err
}

func CreateUser(db *pgxpool.Pool, username string) (int, error) {
	var userId int
	row := db.QueryRow(context.Background(), "INSERT INTO users (username) VALUES ($1) RETURNING id", username)
	err := row.Scan(&userId)
	return userId, err
}