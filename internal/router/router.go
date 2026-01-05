package router

import (
	"github.com/go-chi/chi/v5"
)

func Setup(db *pgxpool.Pool) chi.Router {
	r := chi.NewRouter()
	setUpRoutes(r)
	return r
}

func setUpRoutes(r chi.Router) {
	r.Group(func(r chi.Router) {
		r.Get("/users", func(w http.ResponseWriter, req *http.Request) {
			response, _ := users.HandleList(w, req)

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
		})
	})
}
