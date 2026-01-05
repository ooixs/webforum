package login

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}