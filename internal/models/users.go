package models

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID   int    `json:"id"`
	Username string `json:"username"`
}

//Checks whether the username the user enters is in the database for login purposes
func GetUser(db *pgxpool.Pool, username string) (*User, error) {
	var user User
	row := db.QueryRow(context.Background(), "SELECT * FROM users WHERE username=$1", username)
	err := row.Scan(&user.ID, &user.Username)
	return &user, err
}

//Gets the username of a user when given the id of the user
func GetUserById(db *pgxpool.Pool, id int) (*User, error) {
	var user User
	row := db.QueryRow(context.Background(), "SELECT * FROM users WHERE id=$1", id)
	err := row.Scan(&user.ID, &user.Username)
	return &user, err
}

//Checks whether the username the user enters is in the database, and if not, adds it to the database and registers the user
func CreateUser(db *pgxpool.Pool, username string) (int, error) {
	var userId int
	row := db.QueryRow(context.Background(), "INSERT INTO users (username) VALUES ($1) RETURNING id", username)
	err := row.Scan(&userId)
	return userId, err
}

//Gets all of the users from the database
func GetAllUsers(db *pgxpool.Pool) ([]User, error) {
	var users []User
	rows, err := db.Query(context.Background(), "SELECT * FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Username)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}