package database

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

var db *pgxpool.Pool

// Initalise the connection to the database once at server startup
func InitDB(connStr string) (*pgxpool.Pool, error) {
	var err error
	db, err = pgxpool.New(context.Background(), connStr)
	return db, err
}

//Future calls will use GetDB to prevent multiple connections
func GetDB() *pgxpool.Pool {
	return db
}
