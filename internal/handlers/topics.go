package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ooixs/webforum/internal/database"
	"github.com/ooixs/webforum/internal/models"
)

//Gets all of the topics in the database
func HandleGetTopic(w http.ResponseWriter, r *http.Request) {
	db := database.GetDB()
	res, err := models.GetTopic(db)
	if err != nil {
		http.Error(w, "Get topic server error", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}