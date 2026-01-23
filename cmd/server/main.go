package main

import (
	"os"
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/ooixs/webforum/internal/router"
	"github.com/ooixs/webforum/internal/database"
)

func main() {
	//Loads .env file for the database connection string
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db, err := database.InitDB(os.Getenv("connStr"))
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer db.Close()
	r := router.Setup()
	fmt.Print("Listening on port 8080 at http://localhost:8080!")

	log.Fatalln(http.ListenAndServe(":8080", r))
}