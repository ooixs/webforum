package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/ooixs/webforum/internal/database"
	"github.com/ooixs/webforum/internal/models"
	"github.com/pkg/errors"
)

func HandleGetTopic(w http.ResponseWriter, r *http.Request) {
	db := database.GetDB()
	res, err := models.GetTopic(db)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(w, "Topics not found", 404)
		} else {
			http.Error(w, "Server error", 500)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}