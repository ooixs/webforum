package login

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID   int    `json:"id"`
	Username string `json:"username"`
}

func GetUserByUsername(db *pgxpool.Pool, username string) (*User, error) {
	var user User
	row := db.QueryRow(context.Background(), "SELECT id, username FROM users WHERE username=$1", username)
	err := row.Scan(&user.ID, &user.Username)
	return &user, err
}

func CreateUser(db *pgxpool.Pool, username string) error {
	_, err := db.Exec(context.Background(), "INSERT INTO users (username) VALUES ($1)", username)
	return err
}