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
		r.Get("/posts/{topicId}", handlers.HandleGetPost)
		r.Post("/posts", handlers.HandleCreatePost)
	})
}
