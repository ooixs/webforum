package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/ooixs/webforum/internal/database"
	"github.com/ooixs/webforum/internal/router"
)

func main() {
	//Loads .env file for the database connection string
	_ = godotenv.Load()

	db, err := database.InitDB(os.Getenv("DATABASE_URL"))
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer db.Close()
	r := router.Setup()
	fmt.Print("Listening on port " + port + " at http://localhost:" + port + "!")

	log.Fatalln(http.ListenAndServe(":"+port, r))
}