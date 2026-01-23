package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ooixs/webforum/internal/database"
	"github.com/ooixs/webforum/internal/models"
)

type Reply struct {
	PostId int `json:"post_id"`
	UserId int `json:"user_id"`
	Content string `json:"content"`
}

type ReplyUpdate struct {
	Id int `json:"id"`
	Content string `json:"content"`
}

type ReplyDelete struct {
	Id int `json:"id"`
}

//Gets all replies for a post
func HandleGetReplies(w http.ResponseWriter, r *http.Request) {
	postId := chi.URLParam(r, "postId")
	db := database.GetDB()
	postIdInt, err := strconv.Atoi(postId)
	if err != nil {
		http.Error(w, "Invalid post ID", 400)
		return
	}
	res, err := models.GetReplies(db, postIdInt)
	if err != nil {
		http.Error(w, "Get reply server error", 500)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

//Adds a newly created reply to the database
func HandleCreateReply(w http.ResponseWriter, r *http.Request) {
	var reply Reply
	err := json.NewDecoder(r.Body).Decode(&reply)
	if err != nil {
		http.Error(w, "Invalid post input", 400)
		return
	}
	db := database.GetDB()
	err = models.CreateReply(db, reply.PostId, reply.UserId, reply.Content)
	if err != nil {
		http.Error(w, "Create reply server error", 500)
		return
	}
}

//Updates the reply content in the database
func HandleUpdateReply(w http.ResponseWriter, r *http.Request) {
	var reply ReplyUpdate
	err := json.NewDecoder(r.Body).Decode(&reply)
	if err != nil {
		http.Error(w, "Invalid post input", 400)
		return
	}
	db := database.GetDB()
	err = models.UpdateReply(db, reply.Id, reply.Content)
	if err != nil {
		http.Error(w, "Update reply server error", 500)
		return
	}
}

//Deletes the reply in the database
func HandleDeleteReply(w http.ResponseWriter, r *http.Request) {
	var reply ReplyDelete
	err := json.NewDecoder(r.Body).Decode(&reply)
	if err != nil {
		http.Error(w, "Invalid ID", 400)
		return
	}
	db := database.GetDB()
	err = models.DeleteReply(db, reply.Id)
	if err != nil {
		http.Error(w, "Delete reply server error", 500)
		return
	}
}

//Gets the post associated with the replies
func HandleGetPostForReplies(w http.ResponseWriter, r *http.Request) {
	postId := chi.URLParam(r, "postId")
	db := database.GetDB()
	postIdInt, err := strconv.Atoi(postId)
	if err != nil {
		http.Error(w, "Invalid post ID", 400)
		return
	}
	res, err := models.GetPostForReplies(db, postIdInt)
	if err != nil {
		http.Error(w, "Get post server error", 500)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}