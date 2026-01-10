package router

import (
	"github.com/go-chi/chi/v5"
	"github.com/ooixs/webforum/internal/handlers"
)

func Setup() chi.Router {
	r := chi.NewRouter()
	setUpRoutes(r)
	return r
}

func setUpRoutes(r chi.Router) {
	r.Group(func(r chi.Router) {
		r.Post("/login", handlers.HandleLogin)
		r.Post("/register", handlers.HandleRegister)
		r.Get("/topics", handlers.HandleGetTopic)
		r.Get("/posts/{topicId}", handlers.HandleGetPosts)
		r.Post("/posts", handlers.HandleCreatePost)
		r.Get("/users", handlers.HandleGetAllUsers)
		r.Post("/posts/update", handlers.HandleUpdatePost)
		r.Post("/posts/delete", handlers.HandleDeletePost)
		r.Get("/replies/{postId}", handlers.HandleGetReplies)
		r.Post("/replies", handlers.HandleCreateReply)
		r.Post("/replies/update", handlers.HandleUpdateReply)
		r.Post("/replies/delete", handlers.HandleDeleteReply)
		r.Get("/post/{postId}", handlers.HandleGetPostForReplies)
	})
}
