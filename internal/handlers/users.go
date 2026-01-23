package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ooixs/webforum/internal/database"
	"github.com/ooixs/webforum/internal/models"
)

//Gets the username of a user when given the id of the user
func HandleGetUserById(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		http.Error(w, "Invalid user ID", 400)
		return
	}
	db := database.GetDB()
	res, err := models.GetUserById(db, userIdInt)
	if err != nil {
		http.Error(w, "Get user server error", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

//Gets all of the users from the database
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