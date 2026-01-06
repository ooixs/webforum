package login

import (
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/ooixs/webforum/internal/database"
	"github.com/ooixs/webforum/internal/models"
	"github.com/pkg/errors"
)

func HandleGetUser(w http.ResponseWriter, r *http.Request) {
	db:= database.GetDB()
		var username string
		err := json.NewDecoder(r.Body).Decode(&username)
		if err != nil {
			http.Error(w, "Invalid input", 400)
			return
		}
		user, err := login.GetUserByUsername(db, username)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				http.Error(w, "User not found", 404)
			} else {
				http.Error(w, "Server error", 500)
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
	}