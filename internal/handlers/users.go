package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ooixs/webforum/internal/database"
	"github.com/ooixs/webforum/internal/models"
)

func HandleGetAllUsers(w http.ResponseWriter, r *http.Request) {
	db := database.GetDB()
	res, err := models.GetAllUsers(db)
	if err != nil {
		http.Error(w, "Get all users server error", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}