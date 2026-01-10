package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/ooixs/webforum/internal/database"
	"github.com/ooixs/webforum/internal/models"
	"github.com/pkg/errors"
)

type User struct {
	Username string `json:"username"`
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid username input", 400)
		return
	}
	db := database.GetDB()
	res, err := models.GetUser(db, user.Username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(w, "User not found", 404)
		} else {
			http.Error(w, "Get user server error", 500)
		}
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid username input", 400)
		return
	}
	db := database.GetDB()
	res, err := models.CreateUser(db, user.Username)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			http.Error(w, "Username already taken", 409)
		} else {
			http.Error(w, "Create user server error", 500)
		}
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}