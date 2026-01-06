package login

import (
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/ooixs/webforum/internal/database"
	login "github.com/ooixs/webforum/internal/models"
	"github.com/pkg/errors"
)

type User struct {
	Username string `json:"username"`
}

func HandleGetUser(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid input", 400)
		return
	}
	db := database.GetDB()
	res, err := login.GetUserByUsername(db, user.Username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(w, "User not found", 404)
		} else {
			http.Error(w, "Server error", 500)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}