package router

import (
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/ooixs/webforum/internal/handlers"
)

func Setup() chi.Router {
	r := chi.NewRouter()
	setUpRoutes(r)
	return r
}

func setUpRoutes(r chi.Router) {
	frontendURL := os.Getenv("FRONTEND_URL") 
    if frontendURL == "" {
        frontendURL = "http://localhost:5173"
    }

	r.Use(cors.Handler(cors.Options{
        AllowedOrigins:   []string{frontendURL}, 
        AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
        AllowCredentials: true,
    }))

	r.Route("/api", func(r chi.Router) {
		//For Login/Register
		r.Post("/login", handlers.HandleLogin)
		r.Post("/register", handlers.HandleRegister)

		//For Topics
		r.Get("/topics", handlers.HandleGetTopic)

		//For Posts
		r.Get("/posts/{topicId}", handlers.HandleGetPosts)
		r.Post("/posts", handlers.HandleCreatePost)
		r.Post("/posts/update", handlers.HandleUpdatePost)
		r.Post("/posts/delete", handlers.HandleDeletePost)
		r.Get("/topic/{topicId}", handlers.HandleGetTopicForPosts)
		
		//For Replies
		r.Get("/replies/{postId}", handlers.HandleGetReplies)
		r.Post("/replies", handlers.HandleCreateReply)
		r.Post("/replies/update", handlers.HandleUpdateReply)
		r.Post("/replies/delete", handlers.HandleDeleteReply)
		r.Get("/post/{postId}", handlers.HandleGetPostForReplies)

		//Utility, for both posts and replies
		r.Get("/user/{userId}", handlers.HandleGetUserById)
		r.Get("/users", handlers.HandleGetAllUsers)
	})
}
