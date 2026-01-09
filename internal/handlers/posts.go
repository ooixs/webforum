package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ooixs/webforum/internal/database"
	"github.com/ooixs/webforum/internal/models"
)

type Post struct {
	TopicId int `json:"topic_id"`
	UserId int `json:"user_id"`
	Heading string `json:"heading"`
	Content string `json:"content"`
}

func HandleGetPost(w http.ResponseWriter, r *http.Request) {
	topicId := chi.URLParam(r, "topicId")
	db := database.GetDB()
	topicIdInt, err := strconv.Atoi(topicId)
	if err != nil {
		http.Error(w, "Invalid topic ID", 400)
		return
	}
	res, err := models.GetPost(db, topicIdInt)
	if err != nil {
		http.Error(w, "Server error", 500)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func HandleCreatePost(w http.ResponseWriter, r *http.Request) {
	var post Post
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		http.Error(w, "Invalid post input", 400)
		return
	}
	db := database.GetDB()
	res, err := models.CreatePost(db, post.TopicId, post.UserId, post.Heading, post.Content)
	if err != nil {
		http.Error(w, "Server error", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func HandleGetAllUsers(w http.ResponseWriter, r *http.Request) {
	db := database.GetDB()
	res, err := models.GetAllUsers(db)
	if err != nil {
		http.Error(w, "Server error", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}