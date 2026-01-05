package main

import (
	"os"
	"fmt"
	"log"
	"net/http"
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/ooixs/webforum/internal/router"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db, err := pgxpool.New(context.Background(), os.Getenv("url"))
	r := router.Setup(db)
	fmt.Print("Listening on port 8000 at http://localhost:8000!")

	log.Fatalln(http.ListenAndServe(":8000", r))
}