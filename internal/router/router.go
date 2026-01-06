package router

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/ooixs/webforum/internal/handlers"
)

func Setup(db *pgxpool.Pool) chi.Router {
	r := chi.NewRouter()
	setUpRoutes(r)
	return r
}

func setUpRoutes(r chi.Router) {
	r.Group(func(r chi.Router) {
		r.Post("/login", login.HandleGetUser)
	})
}
