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
		r.Post("/login", handlers.HandleGetUser)
		r.Get("/topics", handlers.HandleGetTopic)
	})
}
