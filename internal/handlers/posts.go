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

type PostUpdate struct {
	Id int `json:"id"`
	Heading string `json:"heading"`
	Content string `json:"content"`
}

type PostDelete struct {
	Id int `json:"id"`
}

func HandleGetPosts(w http.ResponseWriter, r *http.Request) {
	topicId := chi.URLParam(r, "topicId")
	db := database.GetDB()
	topicIdInt, err := strconv.Atoi(topicId)
	if err != nil {
		http.Error(w, "Invalid topic ID", 400)
		return
	}
	res, err := models.GetPosts(db, topicIdInt)
	if err != nil {
		http.Error(w, "Get post server error", 500)
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
	err = models.CreatePost(db, post.TopicId, post.UserId, post.Heading, post.Content)
	if err != nil {
		http.Error(w, "Create post server error", 500)
		return
	}
}

func HandleUpdatePost(w http.ResponseWriter, r *http.Request) {
	var post PostUpdate
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		http.Error(w, "Invalid post input", 400)
		return
	}
	db := database.GetDB()
	err = models.UpdatePost(db, post.Id, post.Heading, post.Content)
	if err != nil {
		http.Error(w, "Update post server error", 500)
		return
	}
}

func HandleDeletePost(w http.ResponseWriter, r *http.Request) {
	var post PostDelete
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		http.Error(w, "Invalid ID", 400)
		return
	}
	db := database.GetDB()
	err = models.DeletePost(db, post.Id)
	if err != nil {
		http.Error(w, "Delete post server error", 500)
		return
	}
}

func HandleGetTopicForPosts(w http.ResponseWriter, r *http.Request) {
	topicId := chi.URLParam(r, "topicId")
	db := database.GetDB()
	topicIdInt, err := strconv.Atoi(topicId)
	if err != nil {
		http.Error(w, "Invalid topic ID", 400)
		return
	}
	res, err := models.GetTopicForPosts(db, topicIdInt)
	if err != nil {
		http.Error(w, "Get topic server error", 500)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}